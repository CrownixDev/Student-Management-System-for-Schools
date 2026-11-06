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

  async create(classId: string, data: z.infer<typeof enrollmentCreateSchema>) {
    const parsedRes = enrollmentCreateSchema.safeParse(data);
    if (!parsedRes.success) {
      throw new ApiErrorV2("Data validation failed");
    }

    try {
      await Promise.all(
        parsedRes.data.map(async (st) => {
          return this.repository.updateMany({ studentId: st.studentId }, { endedOn: new Date() });
        }),
      );

      await Promise.all(
        parsedRes.data.map(async (st) => {
          return this.repository.create({
            class: { connect: { id: classId } },
            student: { connect: { id: st.studentId } },
            classIndex: st.classIndex,
            enrollmentSubjects: {
              createMany: {
                data: await Promise.all(
                  st.subjects.map(async (s) => {
                    const classSubject = await this.repository.getClassSubject(classId, s.subjectId);
                    if (!classSubject) throw new ApiErrorV2("Class subject not found");
                    return { classSubjectId: classSubject.id, mediumId: s.mediumId };
                  }),
                ),
              },
            },
          });
        }),
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ApiErrorV2("Student already enrolled this class");
        }
      }
      throw error;
    }
  }

  async updateIndex(classId: string, studentId: string, data: z.infer<typeof enrollmentIndexUpdateSchema>) {
    if (!studentId || !classId) throw new ApiErrorV2("Class and Student ids are required");

    const parsedRes = enrollmentIndexUpdateSchema.safeParse(data);
    if (!parsedRes.success) {
      throw new ApiErrorV2("Data validation failed");
    }

    try {
      const enrollmentId = await this.repository.getId(classId, studentId);
      if (!enrollmentId) throw new ApiErrorV2("Enrollment not found");

      await this.repository.update(enrollmentId, { classIndex: parsedRes.data.classIndex });
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
    classId: string,
    studentId: string,
    data: z.infer<typeof enrollmentSubjectUpdateSchema>,
  ) {
    if (!studentId || !classId) throw new ApiErrorV2("Class and Student ids are required");

    const parsedRes = enrollmentSubjectUpdateSchema.safeParse(data);
    if (!parsedRes.success) {
      throw new ApiErrorV2("Data validation failed");
    }

    try {
      if (parsedRes.data.enrolled) {
        const enrollmentId = await this.repository.getId(classId, studentId);
        if (!enrollmentId) throw new ApiErrorV2("Enrollment not found");

        const classSubject = await this.repository.getClassSubject(classId, parsedRes.data.subjectId);
        if (!classSubject) throw new ApiErrorV2("Class subject not found");

        await this.repository.createSubject(enrollmentId, classSubject.id, classSubject.mediumId);
      } else {
        const enrollmentId = await this.repository.getId(classId, studentId);
        if (!enrollmentId) throw new ApiErrorV2("Enrollment not found");

        const enrollmentRelations = await this.repository.getSubjectRelations(enrollmentId, parsedRes.data.subjectId);
        if (!enrollmentRelations) throw new ApiErrorV2("Enrollment not found");

        // Do not delete the enrolled subject if student has any marks related to that
        const hasRelations = enrollmentRelations.marks.length > 0;
        if (hasRelations) {
          throw new ApiErrorV2("This subject is currently in use");
        }

        const classSubject = await this.repository.getClassSubject(classId, parsedRes.data.subjectId);
        if (!classSubject) throw new ApiErrorV2("Class subject not found");

        await this.repository.deleteSubject(enrollmentId, classSubject.id);
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new ApiErrorV2("Record not found");
        }
      }
      throw error;
    }
  }

  async updateSubjectMedium(
    classId: string,
    studentId: string,
    data: z.infer<typeof enrollmentSubjectMediumUpdateSchema>,
  ) {
    if (!studentId || !classId) throw new ApiErrorV2("Class and Student ids are required");

    const parsedRes = enrollmentSubjectMediumUpdateSchema.safeParse(data);
    if (!parsedRes.success) {
      throw new ApiErrorV2("Data validation failed");
    }

    try {
      const enrollmentId = await this.repository.getId(classId, studentId);
      if (!enrollmentId) throw new ApiErrorV2("Enrollment not found");

      const classSubject = await this.repository.getClassSubject(classId, parsedRes.data.subjectId);
      if (!classSubject) throw new ApiErrorV2("Class subject not found");

      await this.repository.updateSubject(enrollmentId, classSubject.id, {
        medium: { connect: { id: parsedRes.data.mediumId } },
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

  async delete(classId: string, studentId: string) {
    if (!studentId || !classId) throw new ApiErrorV2("Class and Student ids are required");

    const enrollmentId = await this.repository.getId(classId, studentId);
    if (!enrollmentId) throw new ApiErrorV2("Enrollment not found");

    const relations = await this.repository.getRelations(enrollmentId);
    if (!relations) throw new ApiErrorV2("Enrollment not found");

    const hasRelations = relations.marks.length > 0;
    if (hasRelations) {
      throw new ApiErrorV2("This enrollment is currently in use");
    }

    try {
      await prisma.$transaction(async (tx) => {
        await tx.enrollmentSubject.deleteMany({ where: { enrollmentId } });
        await tx.enrollment.delete({ where: { id: enrollmentId } });
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
