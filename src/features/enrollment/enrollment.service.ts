import {
  enrollmentCreateSchema,
  enrollmentIndexUpdateSchema,
  enrollmentSubjectMediumUpdateSchema,
  enrollmentSubjectUpdateSchema,
} from "./enrollment.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { EnrollmentRepository } from "./enrollment.repository";
import { ApiErrorV2 } from "@/lib/ApiError";
import { prisma } from "@/lib/prisma";
import z from "zod";

export class EnrollmentService {
  constructor(private repository: EnrollmentRepository) {}

  async create(academicYearId: string, classId: string, data: z.infer<typeof enrollmentCreateSchema>) {
    const parsedRes = enrollmentCreateSchema.safeParse(data);
    if (!parsedRes.success) {
      throw new ApiErrorV2("Data validation failed");
    }
    try {
      await Promise.all(
        parsedRes.data.map((st) => {
          this.repository.create({
            class: { connect: { id: classId } },
            academicYear: { connect: { id: academicYearId } },
            student: { connect: { id: st.studentId } },
            classIndex: st.classIndex,
            subjects: {
              createMany: {
                data: st.subjects.map((s) => ({
                  subjectId: s.subjectId,
                  mediumId: s.mediumId,
                })),
              },
            },
          });
        }),
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ApiErrorV2("Student already enrolled for a class");
        }
      }
      throw error;
    }
  }

  async updateIndex(studentId: string, academicYearId: string, data: z.infer<typeof enrollmentIndexUpdateSchema>) {
    if (!studentId || !academicYearId) throw new ApiErrorV2("Student and Academic Year ids are required");

    const parsedRes = enrollmentIndexUpdateSchema.safeParse(data);
    if (!parsedRes.success) {
      throw new ApiErrorV2("Data validation failed");
    }

    try {
      await this.repository.update(studentId, academicYearId, { classIndex: data.classIndex });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new ApiErrorV2("Record not found");
        }
      }
      throw error;
    }
  }

  async updateSubjectEnrollment(
    studentId: string,
    academicYearId: string,
    data: z.infer<typeof enrollmentSubjectUpdateSchema>,
  ) {
    if (!studentId || !academicYearId) throw new ApiErrorV2("Student and Academic Year ids are required");

    const parsedRes = enrollmentSubjectUpdateSchema.safeParse(data);
    if (!parsedRes.success) {
      throw new ApiErrorV2("Data validation failed");
    }

    try {
      if (parsedRes.data.enrolled) {
        await this.repository.update(studentId, academicYearId, {
          subjects: { create: { subject: { connect: { id: parsedRes.data.subjectId } } } },
        });
      } else {
        const enrollmentRelations = await this.repository.getSubjectRelations(
          studentId,
          academicYearId,
          parsedRes.data.subjectId,
        );
        if (!enrollmentRelations) throw new ApiErrorV2("Enrollment not found");

        const hasRelations = enrollmentRelations.marks.length > 0;
        if (hasRelations) {
          throw new ApiErrorV2("This subject is currently in use");
        }

        const enrollment = await this.repository.getId(studentId, academicYearId);
        if (!enrollment) throw new ApiErrorV2("Enrollment not found");
        await prisma.enrollmentSubject.delete({
          where: { enrollmentId_subjectId: { enrollmentId: enrollment.id, subjectId: parsedRes.data.subjectId } },
        });
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new ApiErrorV2("Record not found");
        }
      }
      console.log(error);
      throw error;
    }
  }

  async updateSubjectMedium(
    studentId: string,
    academicYearId: string,
    data: z.infer<typeof enrollmentSubjectMediumUpdateSchema>,
  ) {
    if (!studentId || !academicYearId) throw new ApiErrorV2("Student and Academic Year ids are required");

    const parsedRes = enrollmentSubjectMediumUpdateSchema.safeParse(data);
    if (!parsedRes.success) {
      throw new ApiErrorV2("Data validation failed");
    }

    try {
      const enrollment = await this.repository.getId(studentId, academicYearId);
      if (!enrollment) throw new ApiErrorV2("Enrollment not found");

      await this.repository.updateSubject(enrollment.id, parsedRes.data.subjectId, {
        medium: parsedRes.data.mediumId ? { connect: { id: parsedRes.data.mediumId } } : { disconnect: {} },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new ApiErrorV2("Record not found");
        }
      }
      throw error;
    }
  }

  async delete(studentId: string, academicYearId: string) {
    if (!studentId || !academicYearId) throw new ApiErrorV2("Student and Academic Year ids are required");

    const enrollment = await this.repository.getRelations(studentId, academicYearId);
    if (!enrollment) throw new ApiErrorV2("Enrollment not found");

    const hasRelations = enrollment.marks.length > 0;
    if (hasRelations) {
      throw new ApiErrorV2("This enrollment is currently in use");
    }

    try {
      await prisma.$transaction(async (tx) => {
        const enrollment = await this.repository.getId(studentId, academicYearId);
        if (!enrollment) throw new ApiErrorV2("Enrollment not found");

        await tx.enrollmentSubject.deleteMany({ where: { enrollmentId: enrollment.id } });
        await tx.enrollment.delete({ where: { studentId_academicYearId: { studentId, academicYearId } } });
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new ApiErrorV2("Record not found");
        }
        if (error.code === "P2003") {
          throw new ApiErrorV2("This enrollment is currently in use");
        }
      }
      throw error;
    }
  }
}
