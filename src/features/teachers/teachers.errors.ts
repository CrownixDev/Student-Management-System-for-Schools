import { error } from "@orpc/server";

export const teacherIdRequiredError = error("TEACHER_ID_REQUIRED", {
  message: "Teacher id is required",
});

export const teacherNotFoundError = error("TEACHER_NOT_FOUND", {
  message: "Teacher Not Found",
});
