import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  academicYears,
  batches,
  classes,
  classSubjects,
  enrollmentSubjects,
  enrollments,
  examSubjects,
  exams,
  gradeLevels,
  marks,
  mediums,
  students,
  subjects,
  teachers,
} from "./mock-data";

const adapter = new PrismaBetterSqlite3({
  url: path.join(process.cwd(), "dev.db"),
});
const prisma = new PrismaClient({ adapter });

function getId(ids: Map<string, string>, sourceId: string, model: string) {
  const value = ids.get(sourceId);
  if (!value) {
    throw new Error(`Could not resolve ${model} id for mock record "${sourceId}".`);
  }
  return value;
}

function logStageStart(stage: string, count: number) {
  console.log(`Seeding ${stage} (${count} records)...`);
}

function logStageComplete(stage: string, count: number) {
  console.log(`Finished ${stage} (${count} records).`);
}

async function seed() {
  console.log("Starting mock data seed...");

  const yearIds = new Map<string, string>();
  logStageStart("academic years", academicYears.length);
  for (const year of academicYears) {
    const saved = await prisma.academicYear.upsert({
      where: { name: year.name },
      create: year,
      update: {
        startDate: year.startDate,
        endDate: year.endDate,
        isCurrent: year.isCurrent,
      },
    });
    yearIds.set(year.id, saved.id);
  }
  logStageComplete("academic years", academicYears.length);

  const batchIds = new Map<string, string>();
  logStageStart("batches", batches.length);
  for (const batch of batches) {
    const saved = await prisma.batch.upsert({
      where: { name: batch.name },
      create: batch,
      update: { type: batch.type },
    });
    batchIds.set(batch.id, saved.id);
  }
  logStageComplete("batches", batches.length);

  const gradeIds = new Map<string, string>();
  logStageStart("grades", gradeLevels.length * academicYears.length);
  for (const year of academicYears) {
    for (const grade of gradeLevels) {
      const academicYearId = getId(yearIds, year.id, "academic year");
      const saved = await prisma.gradeLevel.upsert({
        where: { academicYearId_name: { academicYearId, name: grade.name } },
        create: { id: `${grade.id}-${year.id}`, name: grade.name, academicYear: { connect: { id: academicYearId } } },
        update: { name: grade.name },
      });
      gradeIds.set(`${grade.id}:${year.id}`, saved.id);
    }
  }
  logStageComplete("grades", gradeLevels.length * academicYears.length);

  const mediumIds = new Map<string, string>();
  logStageStart("mediums", mediums.length);
  for (const medium of mediums) {
    const saved = await prisma.medium.upsert({
      where: { name: medium.name },
      create: medium,
      update: {},
    });
    mediumIds.set(medium.id, saved.id);
  }
  logStageComplete("mediums", mediums.length);

  const subjectIds = new Map<string, string>();
  logStageStart("subjects", subjects.length);
  for (const subject of subjects) {
    const saved = await prisma.subject.upsert({
      where: {
        name_category: {
          name: subject.name,
          category: subject.category,
        },
      },
      create: subject,
      update: {
        name: subject.name,
        category: subject.category,
      },
    });
    subjectIds.set(subject.id, saved.id);
  }
  logStageComplete("subjects", subjects.length);

  const teacherIds = new Map<string, string>();
  logStageStart("teachers", teachers.length);
  for (const teacher of teachers) {
    const saved = await prisma.teacher.upsert({
      where: { id: teacher.id },
      create: teacher,
      update: {
        fullName: teacher.fullName,
        phone: teacher.phone,
        isActive: teacher.isActive,
      },
    });
    teacherIds.set(teacher.id, saved.id);
  }
  logStageComplete("teachers", teachers.length);

  const classIds = new Map<string, string>();
  logStageStart("classes", classes.length);
  for (const classroom of classes) {
    const gradeLevelId = getId(gradeIds, classroom.gradeLevelRef, "grade");
    const classTeacherId = classroom.classTeacherId
      ? getId(teacherIds, classroom.classTeacherId, "teacher")
      : null;
    const saved = await prisma.class.upsert({
      where: { id: classroom.id },
      create: {
        id: classroom.id,
        name: classroom.name,
        gradeLevelId,
        teacherId: classTeacherId,
      },
      update: { name: classroom.name, gradeLevelId, teacherId: classTeacherId },
    });
    if (classroom.batchId) {
      await prisma.gradeLevel.update({
        where: { id: gradeLevelId },
        data: { batchId: getId(batchIds, classroom.batchId, "batch") },
      });
    }
    classIds.set(classroom.id, saved.id);
  }
  logStageComplete("classes", classes.length);

  const classSubjectIds = new Map<string, string>();
  logStageStart("class subjects", classSubjects.length);
  for (const assignment of classSubjects) {
    const classId = getId(classIds, assignment.classId, "class");
    const subjectId = getId(subjectIds, assignment.subjectId, "subject");
    const mediumId = getId(mediumIds, assignment.mediumId, "medium");
    const teacherId = getId(teacherIds, assignment.teacherId, "teacher");
    const saved = await prisma.classSubject.upsert({
      where: { classId_subjectId: { classId, subjectId } },
      create: { id: assignment.id, classId, subjectId, mediumId, teacherId },
      update: { mediumId, teacherId },
    });
    classSubjectIds.set(assignment.id, saved.id);
  }
  logStageComplete("class subjects", classSubjects.length);

  const studentIds = new Map<string, string>();
  logStageStart("students", students.length);
  for (const student of students) {
    const saved = await prisma.student.upsert({
      where: { admissionNo: student.admissionNo },
      create: student,
      update: {
        fullName: student.fullName,
        dob: student.dob,
        gender: student.gender,
        phone: student.phone,
        address: student.address,
        guardianName: student.guardianName,
        guardianPhone: student.guardianPhone,
        status: student.status,
      },
    });
    studentIds.set(student.id, saved.id);
  }
  logStageComplete("students", students.length);

  const enrollmentIds = new Map<string, string>();
  logStageStart("enrollments", enrollments.length);
  for (const enrollment of enrollments) {
    const studentId = getId(studentIds, enrollment.studentId, "student");
    const classId = getId(classIds, enrollment.classId, "class");
    const saved = await prisma.enrollment.upsert({
      where: { classId_studentId: { studentId, classId } },
      create: { id: enrollment.id, studentId, classId, classIndex: enrollment.classIndex, status: enrollment.status, joinedOn: enrollment.joinedOn },
      update: {
        classId,
        classIndex: enrollment.classIndex,
        status: enrollment.status,
        joinedOn: enrollment.joinedOn,
      },
    });
    enrollmentIds.set(enrollment.id, saved.id);
  }
  logStageComplete("enrollments", enrollments.length);

  logStageStart("enrollment subjects", enrollmentSubjects.length);
  for (const enrollmentSubject of enrollmentSubjects) {
    const enrollmentId = getId(
      enrollmentIds,
      enrollmentSubject.enrollmentId,
      "enrollment",
    );
    const classSubjectId = getId(
      classSubjectIds,
      enrollmentSubject.classSubjectId,
      "class subject",
    );
    const mediumId = getId(mediumIds, enrollmentSubject.mediumId, "medium");
    await prisma.enrollmentSubject.upsert({
      where: { enrollmentId_classSubjectId: { enrollmentId, classSubjectId } },
      create: { id: enrollmentSubject.id, enrollmentId, classSubjectId, mediumId },
      update: { mediumId },
    });
  }
  logStageComplete("enrollment subjects", enrollmentSubjects.length);

  const examIds = new Map<string, string>();
  logStageStart("exams", exams.length);
  for (const exam of exams) {
    const gradeLevelId = getId(gradeIds, exam.gradeLevelRef, "grade");
    const saved = await prisma.exam.upsert({
      where: { gradeLevelId_name: { gradeLevelId, name: exam.name } },
      create: { id: exam.id, name: exam.name, gradeLevelId },
      update: {},
    });
    examIds.set(exam.id, saved.id);
  }
  logStageComplete("exams", exams.length);

  const examSubjectIds = new Map<string, string>();
  logStageStart("exam subjects", examSubjects.length);
  for (const examSubject of examSubjects) {
    const examId = getId(examIds, examSubject.examId, "exam");
    const subjectId = getId(subjectIds, examSubject.subjectId, "subject");
    const saved = await prisma.examSubject.upsert({
      where: { examId_subjectId: { examId, subjectId } },
      create: { id: examSubject.id, examId, subjectId, maxMarks: examSubject.maxMarks, passMark: examSubject.passMark },
      update: {
        maxMarks: examSubject.maxMarks,
        passMark: examSubject.passMark,
      },
    });
    examSubjectIds.set(`${examSubject.examId}:${examSubject.subjectId}`, saved.id);
  }
  logStageComplete("exam subjects", examSubjects.length);

  logStageStart("marks", marks.length);
  for (const [index, mark] of marks.entries()) {
    const enrollmentId = getId(enrollmentIds, mark.enrollmentId, "enrollment");
    const examSubjectId = getId(examSubjectIds, `${mark.examId}:${mark.subjectId}`, "exam subject");
    await prisma.mark.upsert({
      where: { enrollmentId_examSubjectId: { enrollmentId, examSubjectId } },
      create: { id: mark.id, enrollmentId, examSubjectId, marks: mark.marks, status: mark.status },
      update: { marks: mark.marks, status: mark.status },
    });
    if ((index + 1) % 100 === 0) {
      console.log(`  Marks progress: ${index + 1}/${marks.length}`);
    }
  }
  logStageComplete("marks", marks.length);

  console.log(
    `Seeded mock data: ${academicYears.length} academic years, ${batches.length} batches, ` +
      `${gradeLevels.length} grades, ${classes.length} classes, ${students.length} students, ` +
      `${enrollments.length} enrollments, ${exams.length} exams, ${marks.length} marks.`,
  );
  console.log("User records were not changed.");
  console.log("Mock data seed completed successfully.");
}

seed()
  .catch((error: unknown) => {
    console.error("Failed to seed mock data:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
