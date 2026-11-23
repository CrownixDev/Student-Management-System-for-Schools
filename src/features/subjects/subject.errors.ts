import { error } from "@orpc/server";

export const enrollmentIdRequiredError = error("ENROLLMENT_ID_REQUIRED", {
  message: "Enrollment id is required",
});

export const subjectIdRequiredError = error("SUBJECT_ID_REQUIRED", {
  message: "Subject id is required",
});

export const subjectCategoryRequiredError = error("SUBJECT_CATEGORY_REQUIRED", {
  message: "Subject Category is required",
});

export const subjectCodeExistsError = error("SUBJECT_CODE_EXISTS", {
  message: "Subject code is already exists",
});

export const subjectNotFoundError = error("SUBJECT_NOT_FOUND", {
  message: "Subject not found",
});
