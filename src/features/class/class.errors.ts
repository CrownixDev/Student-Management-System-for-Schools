import { error } from "@orpc/server";

export const classIdRequiredError = error("CLASS_ID_REQUIRED", {
  message: "Class id required",
});

export const classNotFoundError = error("CLASS_NOT_FOUND", {
  message: "Class not found",
});

export const gradeIdRequiredError = error("GRADE_ID_REQUIRED", {
  message: "Grade id required",
});

export const classNameExistsError = error("CLASS_NAME_EXISTS", {
  message: "Class name is already exists",
});

export const subjectIdRequiredError = error("SUBJECT_ID_REQUIRED", {
  message: "Subject id required",
});

export const classSubjectNotFoundError = error("CLASS_SUBJECTS_NOT_FOUND", {
  message: "Class subjects not found",
});

export const classSubjectInUseError = error("SUBJECT_IN_USE", {
  message: "This Class Subject is currently in use",
});
