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
  streams,
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

async function seed() {
  const yearIds = new Map<string, string>();
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

  const batchIds = new Map<string, string>();
  for (const batch of batches) {
    const saved = await prisma.batch.upsert({
      where: { name: batch.name },
      create: batch,
      update: {},
    });
    batchIds.set(batch.id, saved.id);
  }

  const gradeIds = new Map<string, string>();
  for (const grade of gradeLevels) {
    const batchId = getId(batchIds, grade.batchId, "batch");
    const saved = await prisma.gradeLevel.upsert({
      where: { number: grade.number },
      create: { ...grade, batchId },
      update: { name: grade.name, batchId },
    });
    gradeIds.set(grade.id, saved.id);
  }

  const mediumIds = new Map<string, string>();
  for (const medium of mediums) {
    const saved = await prisma.medium.upsert({
      where: { name: medium.name },
      create: medium,
      update: {},
    });
    mediumIds.set(medium.id, saved.id);
  }

  const streamIds = new Map<string, string>();
  for (const stream of streams) {
    const saved = await prisma.stream.upsert({
      where: { name: stream.name },
      create: stream,
      update: {},
    });
    streamIds.set(stream.id, saved.id);
  }

  const subjectIds = new Map<string, string>();
  const subjectStreams = Array.from(streamIds.values(), (id) => ({ id }));
  for (const subject of subjects) {
    const saved = await prisma.subject.upsert({
      where: { code: subject.code },
      create: { ...subject, streams: { connect: subjectStreams } },
      update: {
        name: subject.name,
        category: subject.category,
        streams: { connect: subjectStreams },
      },
    });
    subjectIds.set(subject.id, saved.id);
  }

  const teacherIds = new Map<string, string>();
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

  const classIds = new Map<string, string>();
  for (const classroom of classes) {
    const academicYearId = getId(yearIds, classroom.academicYearId, "academic year");
    const gradeLevelId = getId(gradeIds, classroom.gradeLevelId, "grade");
    const streamId = classroom.streamId
      ? getId(streamIds, classroom.streamId, "stream")
      : null;
    const defaultMediumId = classroom.defaultMediumId
      ? getId(mediumIds, classroom.defaultMediumId, "medium")
      : null;
    const classTeacherId = classroom.classTeacherId
      ? getId(teacherIds, classroom.classTeacherId, "teacher")
      : null;
    const saved = await prisma.class.upsert({
      where: {
        academicYearId_gradeLevelId_name: {
          academicYearId,
          gradeLevelId,
          name: classroom.name,
        },
      },
      create: {
        ...classroom,
        academicYearId,
        gradeLevelId,
        streamId,
        defaultMediumId,
        classTeacherId,
      },
      update: { streamId, defaultMediumId, classTeacherId },
    });
    classIds.set(classroom.id, saved.id);
  }

  for (const assignment of classSubjects) {
    const classId = getId(classIds, assignment.classId, "class");
    const subjectId = getId(subjectIds, assignment.subjectId, "subject");
    const mediumId = assignment.mediumId
      ? getId(mediumIds, assignment.mediumId, "medium")
      : null;
    const teacherId = getId(teacherIds, assignment.teacherId, "teacher");
    await prisma.classSubject.upsert({
      where: { classId_subjectId: { classId, subjectId } },
      create: { ...assignment, classId, subjectId, mediumId, teacherId },
      update: { mediumId, teacherId },
    });
  }

  const studentIds = new Map<string, string>();
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

  const enrollmentIds = new Map<string, string>();
  for (const enrollment of enrollments) {
    const studentId = getId(studentIds, enrollment.studentId, "student");
    const classId = getId(classIds, enrollment.classId, "class");
    const academicYearId = getId(yearIds, enrollment.academicYearId, "academic year");
    const saved = await prisma.enrollment.upsert({
      where: { studentId_academicYearId: { studentId, academicYearId } },
      create: { ...enrollment, studentId, classId, academicYearId },
      update: {
        classId,
        classIndex: enrollment.classIndex,
        status: enrollment.status,
        joinedOn: enrollment.joinedOn,
      },
    });
    enrollmentIds.set(enrollment.id, saved.id);
  }

  for (const enrollmentSubject of enrollmentSubjects) {
    const enrollmentId = getId(
      enrollmentIds,
      enrollmentSubject.enrollmentId,
      "enrollment",
    );
    const subjectId = getId(subjectIds, enrollmentSubject.subjectId, "subject");
    const mediumId = enrollmentSubject.mediumId
      ? getId(mediumIds, enrollmentSubject.mediumId, "medium")
      : null;
    await prisma.enrollmentSubject.upsert({
      where: { enrollmentId_subjectId: { enrollmentId, subjectId } },
      create: { ...enrollmentSubject, enrollmentId, subjectId, mediumId },
      update: { mediumId },
    });
  }

  const examIds = new Map<string, string>();
  for (const exam of exams) {
    const academicYearId = getId(yearIds, exam.academicYearId, "academic year");
    const gradeLevelId = getId(gradeIds, exam.gradeLevelId, "grade");
    const saved = await prisma.exam.upsert({
      where: {
        academicYearId_gradeLevelId_name: {
          academicYearId,
          gradeLevelId,
          name: exam.name,
        },
      },
      create: { ...exam, academicYearId, gradeLevelId },
      update: {},
    });
    examIds.set(exam.id, saved.id);
  }

  for (const examSubject of examSubjects) {
    const examId = getId(examIds, examSubject.examId, "exam");
    const subjectId = getId(subjectIds, examSubject.subjectId, "subject");
    await prisma.examSubject.upsert({
      where: { examId_subjectId: { examId, subjectId } },
      create: { ...examSubject, examId, subjectId },
      update: {
        maxMarks: examSubject.maxMarks,
        passMark: examSubject.passMark,
      },
    });
  }

  for (const mark of marks) {
    const examId = getId(examIds, mark.examId, "exam");
    const enrollmentId = getId(enrollmentIds, mark.enrollmentId, "enrollment");
    const subjectId = getId(subjectIds, mark.subjectId, "subject");
    await prisma.mark.upsert({
      where: { examId_enrollmentId_subjectId: { examId, enrollmentId, subjectId } },
      create: { ...mark, examId, enrollmentId, subjectId },
      update: { marks: mark.marks, status: mark.status },
    });
  }

  console.log(
    `Seeded mock data: ${academicYears.length} academic years, ${batches.length} batches, ` +
      `${gradeLevels.length} grades, ${classes.length} classes, ${students.length} students, ` +
      `${enrollments.length} enrollments, ${exams.length} exams, ${marks.length} marks.`,
  );
  console.log("GradeBand and User records were not changed.");
}

seed()
  .catch((error: unknown) => {
    console.error("Failed to seed mock data:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
