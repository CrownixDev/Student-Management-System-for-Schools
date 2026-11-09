import "server-only";

import {
  IExamByEnrollmentId,
  IExamClassData,
  IExamListItem,
  IExamSubject,
  IExamTopResults,
  TopResultStudent,
  TopResultStudentWithClass,
} from "./exams.types";
import { AcademicYearsRepository } from "../academic-years/year.repository";
import { ApiErrorV2 } from "@/lib/ApiError";
import { EnrollmentRepository } from "../enrollment/enrollment.repository";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { ExamRepository } from "./exams.repository";
import { GradesRepository } from "../grades/grades.repository";
import { MarkStatus } from "@/generated/prisma/enums";
import { ClassRepository } from "../class/class.repository";
import { examMarksSchema, examSchema } from "./exams.schema";
import { prisma } from "@/lib/prisma";
import z from "zod";

const rankTopResults = <T extends TopResultStudent>(students: Iterable<T>): T[] =>
  Array.from(students).sort(
    (a, b) => b.fullMarks - a.fullMarks || a.fullName.localeCompare(b.fullName) || a.id.localeCompare(b.id),
  );

export class ExamService {
  constructor(
    private repository: ExamRepository,
    private enrollmentRepository: EnrollmentRepository,
    private gradesRepository: GradesRepository,
    private classRepository: ClassRepository,
    private yearRepository: AcademicYearsRepository,
  ) {}

  async getList(gradeId: string): Promise<IExamListItem[]> {
    if (!gradeId) throw new ApiErrorV2("Grade id is required");
    return await this.repository.getList(gradeId);
  }

  async getListItemById(examId: string): Promise<IExamListItem> {
    if (!examId) throw new ApiErrorV2("Exam id is required");
    const exam = await this.repository.getListItemById(examId);
    if (!exam) throw new ApiErrorV2("Exam not found");
    return exam;
  }

  async getExamSubjects(examId: string): Promise<IExamSubject[]> {
    if (!examId) throw new ApiErrorV2("Exam id is required");
    return await this.repository.getExamSubjects(examId);
  }

  async getDataByEnrollmentId(enrollmentId: string): Promise<IExamByEnrollmentId[]> {
    if (!enrollmentId) throw new ApiErrorV2("Enrollment id is required");

    const enrollment = await this.enrollmentRepository.getById(enrollmentId);
    if (!enrollment) {
      throw new ApiErrorV2("Enrollment not found");
    }

    const exams = await this.repository.getList(enrollment.class.gradeLevelId);

    const marksByExamAndSubject = new Map(
      enrollment.marks.map((mark) => [`${mark.examSubject.examId}:${mark.examSubject.subjectId}`, mark]),
    );

    return exams.map((exam) => ({
      id: exam.id,
      name: exam.name,
      subjects: enrollment.enrollmentSubjects.map(({ classSubject, medium }) => {
        const { subject } = classSubject;
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

  async getTopResults(gradeId: string, examId: string): Promise<IExamTopResults> {
    if (!gradeId || !examId) throw new ApiErrorV2("Year, grade and exam ids are required");

    const [exam, grade] = await Promise.all([
      this.getListItemById(examId),
      this.gradesRepository.getAllStudentsWithResults(gradeId, examId),
    ]);
    if (!exam) throw new ApiErrorV2("Exam not found");
    if (!grade) throw new ApiErrorV2("Grade not found");

    const ignoredRankingSubjectIds = new Set(
      exam.examSubjects.filter((examSubject) => examSubject.ignoreRanking).map((examSubject) => examSubject.subject.id),
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
      const students = new Map<string, TopResultStudent & { classIndex: number | null }>();

      for (const enrollment of classItem.enrollments) {
        const marksBySubjectId = new Map(enrollment.marks.map((mark) => [mark.examSubject.subject.id, mark]));
        const studentInfo = {
          id: enrollment.student.id,
          fullName: enrollment.student.fullName,
          admissionNo: enrollment.student.admissionNo,
        };
        const studentClass = { id: classItem.id, name: classItem.name };
        const classStudent = students.get(enrollment.student.id) ?? {
          ...studentInfo,
          classIndex: enrollment.classIndex,
          fullMarks: 0,
        };
        students.set(enrollment.student.id, classStudent);

        const gradeStudent = byGrade.get(enrollment.student.id) ?? {
          ...studentInfo,
          fullMarks: 0,
          class: studentClass,
        };
        byGrade.set(enrollment.student.id, gradeStudent);

        for (const { classSubject, medium } of enrollment.enrollmentSubjects) {
          const { subject } = classSubject;
          if (ignoredRankingSubjectIds.has(subject.id)) continue;

          const mark = marksBySubjectId.get(subject.id);
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
          if (ignoredRankingSubjectIds.has(mark.examSubject.subject.id)) continue;

          const subjectResult = subjectResults.get(mark.examSubject.subject.id);
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
        topResult: rankTopResults(students.values()),
      };
    });

    return {
      byGrade: rankTopResults(byGrade.values()),
      byClass,
      bySubject: Array.from(subjectResults.values()).map(({ students, ...subject }) => ({
        ...subject,
        topResult: rankTopResults(students.values()),
      })),
    };
  }

  async getExamDataForClass(yearId: string, gradeId: string, classId: string, examId: string): Promise<IExamClassData> {
    if (!yearId || !gradeId || !classId || !examId) {
      throw new ApiErrorV2("Year, grade, class and exam ids are required");
    }

    const classData = await this.classRepository.getStudentsWithExamData(yearId, gradeId, classId, examId);
    if (!classData) throw new ApiErrorV2("Class not found");

    return {
      id: classData.id,
      name: classData.name,
      gradeLevel: classData.gradeLevel,
      academicYear: classData.gradeLevel.academicYear,
      students: classData.enrollments.map((enrollment) => ({
        id: enrollment.student.id,
        admissionNo: enrollment.student.admissionNo,
        enrollmentId: enrollment.id,
        fullName: enrollment.student.fullName,
        classIndex: enrollment.classIndex,
        subjects: enrollment.marks.map((mark) => ({
          id: mark.examSubject.subject.id,
          name: mark.examSubject.subject.name,
          code: mark.examSubject.subject.code,
          result: {
            marks: mark.marks,
            status: mark.status,
          },
        })),
      })),
    };
  }

  async updateMarks(examId: string, data: z.infer<typeof examMarksSchema>) {
    if (!examId) throw new ApiErrorV2("Exam id is required");

    const [activeYear, exam] = await Promise.all([
      this.yearRepository.getActiveYear(),
      this.repository.getListItemById(examId),
    ]);

    if (!activeYear) throw new ApiErrorV2("No active years found");
    if (!exam) throw new ApiErrorV2("Exam not found");

    if (exam.gradeLevel.academicYear.id !== activeYear.id) {
      throw new ApiErrorV2("You can only edit marks from active year");
    }

    const parsedRes = examMarksSchema.safeParse(data);
    if (!parsedRes.success) {
      throw new ApiErrorV2("Data validation failed");
    }

    const subjectIds = [...new Set(parsedRes.data.map((mark) => mark.subjectId))];
    const examSubjects = await this.repository.getExamSubjectsBySubjectIds(examId, subjectIds);
    const examSubjectIds = new Map(examSubjects.map((examSubject) => [examSubject.subjectId, examSubject.id]));

    if (examSubjects.length !== subjectIds.length) {
      throw new ApiErrorV2("Exam subject not found");
    }

    await prisma.$transaction(async (transaction) => {
      for (const mark of parsedRes.data) {
        const examSubjectId = examSubjectIds.get(mark.subjectId);
        if (!examSubjectId) throw new ApiErrorV2("Exam subject not found");

        await transaction.mark.upsert({
          where: { enrollmentId_examSubjectId: { enrollmentId: mark.enrollmentId, examSubjectId } },
          update: { marks: mark.marks, status: mark.status },
          create: {
            enrollment: { connect: { id: mark.enrollmentId } },
            examSubject: { connect: { id: examSubjectId } },
            marks: mark.marks,
            status: mark.status,
          },
        });
      }
    });
  }

  async create(gradeId: string, data: z.infer<typeof examSchema>) {
    const parsedData = examSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ApiErrorV2("Data validation failed");
    }

    try {
      await this.repository.create({
        name: parsedData.data.name,
        gradeLevel: { connect: { id: gradeId } },
        examSubjects: {
          createMany: {
            data: parsedData.data.examSubjects.map((esub) => ({
              subjectId: esub.subject.id,
              maxMarks: esub.maxMarks,
              passMark: esub.passMark,
              ignoreRanking: esub.ignoreRanking,
            })),
          },
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ApiErrorV2("Exam name already exists");
        }
      }
      throw error;
    }
  }

  async update(examId: string, data: z.infer<typeof examSchema>) {
    if (!examId) throw new ApiErrorV2("Exam id is required");

    const parsedData = examSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ApiErrorV2("Data validation failed");
    }

    try {
      await this.repository.update(examId, {
        name: parsedData.data.name,
        examSubjects: {
          // This is used to update=> if where clause if matched for existing record and, create=> if where does not match any of records
          upsert: parsedData.data.examSubjects.map((esub) => ({
            where: {
              examId_subjectId: { examId, subjectId: esub.subject.id },
            },
            update: {
              maxMarks: esub.maxMarks,
              passMark: esub.passMark,
              ignoreRanking: esub.ignoreRanking,
            },
            create: {
              subject: { connect: { id: esub.subject.id } },
              maxMarks: esub.maxMarks,
              passMark: esub.passMark,
              ignoreRanking: esub.ignoreRanking,
            },
          })),
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ApiErrorV2("Exam name already exists");
        }
        if (error.code === "P2025") {
          throw new ApiErrorV2("Record not found");
        }
      }
      throw error;
    }
  }

  async delete(examId: string) {
    if (!examId) throw new ApiErrorV2("Exam id is required");

    const exam = await this.repository.getRelations(examId);
    if (!exam) throw new ApiErrorV2("Exam not found");

    const hasRelations = exam.examSubjects.some((subject) => subject.marks.length > 0);
    if (hasRelations) {
      throw new ApiErrorV2("This Exam is currently in use");
    }

    try {
      await prisma.$transaction(async (transaction) => {
        await transaction.examSubject.deleteMany({ where: { examId } });
        await this.repository.delete(examId, transaction);
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new ApiErrorV2("Record not found");
        }
        if (error.code === "P2003") {
          throw new ApiErrorV2("This Exam is currently in use");
        }
      }
      throw error;
    }
  }

  async deleteExamSubject(eSubId: string) {
    if (!eSubId) throw new ApiErrorV2("Exam subject id is required");
    console.log(eSubId);
    const esub = await this.repository.getExamSubjectById(eSubId);
    if (!esub) throw new ApiErrorV2("Exam subject not found");
    const esubRel = await this.repository.getRelationsForExamSubject(esub.examId, esub.subjectId);

    // Do not delete the exam subject if any marks assined to it
    const hasRelations = esubRel.length > 0;
    if (hasRelations) {
      throw new ApiErrorV2("This Exam Subject is currently in use");
    }

    try {
      await prisma.examSubject.delete({ where: { id: eSubId } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new ApiErrorV2("Record not found");
        }
        if (error.code === "P2003") {
          throw new ApiErrorV2("This Exam Subject is currently in use");
        }
      }
      throw error;
    }
  }
}
