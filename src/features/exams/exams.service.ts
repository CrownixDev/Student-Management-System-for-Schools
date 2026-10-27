import "server-only";

import { ApiError } from "@/lib/ApiError";
import { EnrollmentRepository } from "../enrollment/enrollment.repository";
import { ExamRepository } from "./exams.repository";
import {
  IExamByEnrollmentId,
  IExamClassData,
  IExamListItem,
  IExamTopResults,
  TopResultStudent,
  TopResultStudentWithClass,
} from "./exams.types";
import { GradesRepository } from "../grades/grades.repository";
import { MarkStatus } from "@/generated/prisma/enums";
import { ClassRepository } from "../class/class.repository";

export class ExamService {
  constructor(
    private repository: ExamRepository,
    private enrollmentRepository: EnrollmentRepository,
    private gradesRepository: GradesRepository,
    private classRepository: ClassRepository,
  ) {}

  async getList(yearId: string, gradeId: string): Promise<IExamListItem[]> {
    if (!yearId || !gradeId) throw new ApiError(400, "Year and grade ids are required");

    const examList = await this.repository.getList(yearId, gradeId);
    return examList.map((exam) => ({
      ...exam,
      examSubjects: exam.examSubjects.map((esub) => ({
        id: esub.subject.id,
        name: esub.subject.name,
        code: esub.subject.code,
        category: esub.subject.category,
        passMark: esub.passMark,
        maxMarks: esub.maxMarks,
      })),
    }));
  }

  async getListItemById(examId: string): Promise<IExamListItem> {
    if (!examId) throw new ApiError(400, "Exam id is required");

    const exam = await this.repository.getListItemById(examId);
    if (!exam) throw new ApiError(404, "Exam not found");
    return {
      ...exam,
      examSubjects: exam.examSubjects.map((esub) => ({
        id: esub.subject.id,
        name: esub.subject.name,
        code: esub.subject.code,
        category: esub.subject.category,
        passMark: esub.passMark,
        maxMarks: esub.maxMarks,
      })),
    };
  }

  async getDataByEnrollmentId(enrollmentId: string): Promise<IExamByEnrollmentId[]> {
    if (!enrollmentId) throw new ApiError(400, "Enrollment id is required");

    const enrollment = await this.enrollmentRepository.getById(enrollmentId);
    if (!enrollment) {
      throw new ApiError(404, "Enrollment not found");
    }

    const exams = await this.repository.getList(enrollment.academicYearId, enrollment.class.gradeLevelId);

    const marksByExamAndSubject = new Map(enrollment.marks.map((mark) => [`${mark.examId}:${mark.subjectId}`, mark]));

    return exams.map((exam) => ({
      id: exam.id,
      name: exam.name,
      subjects: enrollment.subjects.map(({ subject, medium }) => {
        const mark = marksByExamAndSubject.get(`${exam.id}:${subject.id}`);

        return {
          id: subject.id,
          name: subject.name,
          code: subject.code,
          category: subject.category,
          medium: medium?.name ?? null,
          result: {
            marks: mark?.marks ?? null,
            status: mark?.status ?? null,
          },
        };
      }),
    }));
  }

  async getTopResults(yearId: string, gradeId: string, examId: string): Promise<IExamTopResults> {
    if (!yearId || !gradeId || !examId) throw new ApiError(400, "Year, grade and exam ids are required");

    const exam = await this.getListItemById(examId);
    if (exam.academicYear.id !== yearId || exam.gradeLevel.id !== gradeId) {
      throw new ApiError(404, "Exam not found");
    }

    const grade = await this.gradesRepository.getAllStudentsWithResults(yearId, gradeId, examId);

    if (!grade) {
      throw new ApiError(404, "Grade not found");
    }

    const rank = <T extends TopResultStudent>(students: Iterable<T>): T[] =>
      Array.from(students).sort(
        (a, b) => b.fullMarks - a.fullMarks || a.fullName.localeCompare(b.fullName) || a.id.localeCompare(b.id),
      );

    const byGrade = new Map<string, TopResultStudentWithClass>();
    const subjectResults = new Map<
      string,
      {
        id: string;
        name: string;
        students: Map<
          string,
          TopResultStudentWithClass & {
            medium: string | null;
            status: MarkStatus | null;
          }
        >;
      }
    >();

    const byClass = grade.classes.map((classItem) => {
      const students = new Map<string, TopResultStudent>();

      for (const enrollment of classItem.enrollments) {
        const studentInfo = {
          id: enrollment.student.id,
          fullName: enrollment.student.fullName,
          admissionNo: enrollment.student.admissionNo,
        };
        const studentClass = { id: classItem.id, name: classItem.name };
        const classStudent = students.get(enrollment.student.id) ?? { ...studentInfo, fullMarks: 0 };
        students.set(enrollment.student.id, classStudent);

        const gradeStudent = byGrade.get(enrollment.student.id) ?? {
          ...studentInfo,
          fullMarks: 0,
          class: studentClass,
        };
        byGrade.set(enrollment.student.id, gradeStudent);

        for (const { subject, medium } of enrollment.subjects) {
          if (subject.ignoreRanking) continue;

          const mark = enrollment.marks.find((result) => result.subject.id === subject.id);
          const subjectResult = subjectResults.get(subject.id) ?? {
            id: subject.id,
            name: subject.name,
            students: new Map<
              string,
              TopResultStudentWithClass & {
                medium: string | null;
                status: MarkStatus | null;
              }
            >(),
          };
          subjectResult.students.set(enrollment.student.id, {
            ...studentInfo,
            fullMarks: 0,
            class: studentClass,
            medium: medium?.name ?? null,
            status: mark?.status ?? null,
          });
          subjectResults.set(subject.id, subjectResult);
        }

        for (const mark of enrollment.marks) {
          if (mark.subject.ignoreRanking) continue;

          const subjectResult = subjectResults.get(mark.subject.id);
          const subjectStudent = subjectResult?.students.get(enrollment.student.id);
          const earnedMarks = mark.status === "absent" ? 0 : (mark.marks ?? 0);

          if (subjectStudent) {
            subjectStudent.fullMarks += earnedMarks;
          }

          classStudent.fullMarks += earnedMarks;
          gradeStudent.fullMarks += earnedMarks;
        }
      }

      return {
        id: classItem.id,
        name: classItem.name,
        topResult: rank(students.values()),
      };
    });

    return {
      byGrade: rank(byGrade.values()),
      byClass,
      bySubject: Array.from(subjectResults.values()).map(({ students, ...subject }) => ({
        ...subject,
        topResult: rank(students.values()),
      })),
    };
  }

  async getExamDataForClass(yearId: string, gradeId: string, classId: string, examId: string): Promise<IExamClassData> {
    if (!yearId || !gradeId || !classId || !examId) {
      throw new ApiError(400, "Year, grade, class and exam ids are required");
    }

    const classData = await this.classRepository.getStudentsWithExamData(yearId, gradeId, classId, examId);
    if (!classData) throw new ApiError(404, "Class not found");

    return {
      id: classData.id,
      name: classData.name,
      gradeLevel: classData.gradeLevel,
      academicYear: classData.academicYear,
      students: classData.enrollments.map((enrollment) => ({
        id: enrollment.student.id,
        admissionNo: enrollment.student.admissionNo,
        enrollmentId: enrollment.id,
        fullName: enrollment.student.fullName,
        classIndex: enrollment.classIndex,
        subjects: enrollment.marks.map((mark) => ({
          id: mark.subject.id,
          name: mark.subject.name,
          code: mark.subject.code,
          result: {
            marks: mark.marks,
            status: mark.status,
          },
        })),
      })),
    };
  }
}
