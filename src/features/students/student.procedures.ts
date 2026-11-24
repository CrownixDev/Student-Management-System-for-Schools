import { protectedProcedure } from "@/lib/orpc/base";
import {
  admissionNumberExistsError,
  changeDateToTextError,
  changeTextToDateError,
  classAndStudentIdRequiredError,
  classIdRequiredError,
  customFieldIdRequiredError,
  customFieldNameExistsError,
  customFieldNotFoundError,
  studentIdRequiredError,
  studentNotFoundError,
} from "./student.errors";
import { invalidDataProvidedError, recordInUseError } from "@/lib/orpc/errors";
import { studentJsonFieldSchema, studentSchema } from "./student.schema";
import { queryParamsSchema } from "@/lib/filter";
import { studentsService } from ".";
import { roleGuard } from "@/lib/orpc/middleware/role-guard";
import z from "zod";

const studentProcedure = protectedProcedure.errors({
  [admissionNumberExistsError.code]: admissionNumberExistsError,
  [changeDateToTextError.code]: changeDateToTextError,
  [changeTextToDateError.code]: changeTextToDateError,
  [classAndStudentIdRequiredError.code]: classAndStudentIdRequiredError,
  [classIdRequiredError.code]: classIdRequiredError,
  [customFieldIdRequiredError.code]: customFieldIdRequiredError,
  [customFieldNameExistsError.code]: customFieldNameExistsError,
  [customFieldNotFoundError.code]: customFieldNotFoundError,
  [studentIdRequiredError.code]: studentIdRequiredError,
  [studentNotFoundError.code]: studentNotFoundError,
  [invalidDataProvidedError.code]: invalidDataProvidedError,
  [recordInUseError.code]: recordInUseError,
});

export const studentProcedures = {
  getList: studentProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(queryParamsSchema)
    .handler(({ input }) => {
      return studentsService.getList(input);
    }),

  getProfileList: studentProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(
      queryParamsSchema.and(
        z.object({
          gender: z.enum(["male", "female", "all"]),
          dobFrom: z.date().nullable(),
          dobTo: z.date().nullable(),
        }),
      ),
    )
    .handler(({ input }) => {
      return studentsService.getProfileList(input);
    }),

  getListForClass: studentProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ classId: z.string() }))
    .handler(({ input }) => {
      return studentsService.getListForClass(input.classId);
    }),

  getProfileListForClass: studentProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ classId: z.string() }))
    .handler(({ input }) => {
      return studentsService.getProfileListForClass(input.classId);
    }),

  getListForClassWithSubjects: studentProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ classId: z.string() }))
    .handler(({ input }) => {
      return studentsService.getListForClassWithSubjects(input.classId);
    }),

  getById: studentProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ classId: z.string(), studentId: z.string() }))
    .handler(({ input }) => {
      return studentsService.getById(input.classId, input.studentId);
    }),

  getEnrollmentsById: studentProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ studentId: z.string() }))
    .handler(({ input }) => {
      return studentsService.getEnrollmentsById(input.studentId);
    }),

  create: studentProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(studentSchema)
    .handler(({ input }) => {
      return studentsService.create(input);
    }),

  update: studentProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string(), data: studentSchema }))
    .handler(({ input }) => {
      return studentsService.update(input.id, input.data);
    }),

  delete: studentProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string() }))
    .handler(({ input }) => {
      return studentsService.delete(input.id);
    }),

  getJsonFields: studentProcedure.use(roleGuard.adaptInput(() => ["admin"])).handler(() => {
    return studentsService.getJsonFields();
  }),

  createJsonField: studentProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(studentJsonFieldSchema)
    .handler(({ input }) => {
      return studentsService.createJsonField(input);
    }),

  updateJsonField: studentProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string(), data: studentJsonFieldSchema }))
    .handler(({ input }) => {
      return studentsService.updateJsonField(input.id, input.data);
    }),

  deleteJsonField: studentProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string() }))
    .handler(({ input }) => {
      return studentsService.deleteJsonField(input.id);
    }),
};
