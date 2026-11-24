import {
  enrollmentCreateSchema,
  enrollmentIndexUpdateSchema,
  enrollmentSubjectMediumUpdateSchema,
  enrollmentSubjectUpdateSchema,
} from "./enrollment.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { EnrollmentRepository } from "./enrollment.repository";
import { prisma } from "@/lib/prisma";
import {
  classIdRequiredError,
  classSubjectNotFoundError,
  enrollmentNotFoundError,
  studentAlreadyEnrolledError,
  subjectInUseError,
} from "./enrollment.errors";
import { invalidDataProvidedError, recordInUseError } from "@/lib/orpc/errors";
import { studentIdRequiredError } from "../students/student.errors";
import z from "zod";

export class EnrollmentService {
  constructor(private repository: EnrollmentRepository) {}

  async create(classId: string, data: z.infer<typeof enrollmentCreateSchema>) {
    const parsedRes = enrollmentCreateSchema.safeParse(data);
    if (!parsedRes.success) {
      throw new invalidDataProvidedError();
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
                    if (!classSubject) throw new classSubjectNotFoundError();
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
          throw new studentAlreadyEnrolledError();
        }
      }
      throw error;
    }
  }

  async updateIndex(classId: string, studentId: string, data: z.infer<typeof enrollmentIndexUpdateSchema>) {
    if (!classId) throw new classIdRequiredError();
    if (!studentId) throw new studentIdRequiredError();

    const parsedRes = enrollmentIndexUpdateSchema.safeParse(data);
    if (!parsedRes.success) {
      throw new invalidDataProvidedError();
    }

    try {
      const enrollmentId = await this.repository.getId(classId, studentId);
      if (!enrollmentId) throw new enrollmentNotFoundError();

      await this.repository.update(enrollmentId, { classIndex: parsedRes.data.classIndex });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new enrollmentNotFoundError();
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
    if (!classId) throw new classIdRequiredError();
    if (!studentId) throw new studentIdRequiredError();

    const parsedRes = enrollmentSubjectUpdateSchema.safeParse(data);
    if (!parsedRes.success) {
      throw new invalidDataProvidedError();
    }

    try {
      if (parsedRes.data.enrolled) {
        const [enrollmentId, classSubject] = await Promise.all([
          this.repository.getId(classId, studentId),
          this.repository.getClassSubject(classId, parsedRes.data.subjectId),
        ]);

        if (!enrollmentId) throw new enrollmentNotFoundError();
        if (!classSubject) throw new classSubjectNotFoundError();

        await this.repository.createSubject(enrollmentId, classSubject.id, classSubject.mediumId);
      } else {
        const enrollmentId = await this.repository.getId(classId, studentId);
        if (!enrollmentId) throw new enrollmentNotFoundError();

        const enrollmentRelations = await this.repository.getSubjectRelations(enrollmentId, parsedRes.data.subjectId);
        if (!enrollmentRelations) throw new enrollmentNotFoundError();

        // Do not delete the enrolled subject if student has any marks related to that
        const hasRelations = enrollmentRelations.marks.length > 0;
        if (hasRelations) {
          throw new subjectInUseError();
        }

        const classSubject = await this.repository.getClassSubject(classId, parsedRes.data.subjectId);
        if (!classSubject) throw new classSubjectNotFoundError();

        await this.repository.deleteSubject(enrollmentId, classSubject.id);
      }
    } catch (error) {
      throw error;
    }
  }

  async updateSubjectMedium(
    classId: string,
    studentId: string,
    data: z.infer<typeof enrollmentSubjectMediumUpdateSchema>,
  ) {
    if (!classId) throw new classIdRequiredError();
    if (!studentId) throw new studentIdRequiredError();

    const parsedRes = enrollmentSubjectMediumUpdateSchema.safeParse(data);
    if (!parsedRes.success) {
      throw new invalidDataProvidedError();
    }

    try {
      const enrollmentId = await this.repository.getId(classId, studentId);
      if (!enrollmentId) throw new enrollmentNotFoundError();

      const classSubject = await this.repository.getClassSubject(classId, parsedRes.data.subjectId);
      if (!classSubject) throw new classSubjectNotFoundError();

      await this.repository.updateSubject(enrollmentId, classSubject.id, {
        medium: { connect: { id: parsedRes.data.mediumId } },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new enrollmentNotFoundError();
        }
      }
      throw error;
    }
  }

  async delete(classId: string, studentId: string) {
    if (!classId) throw new classIdRequiredError();
    if (!studentId) throw new studentIdRequiredError();

    const enrollmentId = await this.repository.getId(classId, studentId);
    if (!enrollmentId) throw new enrollmentNotFoundError();

    const relations = await this.repository.getRelations(enrollmentId);
    if (!relations) throw new enrollmentNotFoundError();

    const hasRelations = relations.marks.length > 0;
    if (hasRelations) {
      throw new recordInUseError();
    }

    try {
      await prisma.$transaction(async (tx) => {
        await tx.enrollmentSubject.deleteMany({ where: { enrollmentId } });
        await tx.enrollment.delete({ where: { id: enrollmentId } });
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new enrollmentNotFoundError();
        }
        if (error.code === "P2003") {
          throw new recordInUseError();
        }
      }
      throw error;
    }
  }
}
