import { error } from "@orpc/server";

export const yearIdRequiredError = error("YEAR_ID_REQUIRED", {
  message: "Year id is required",
});

export const gradeIdRequiredError = error("GRADE_ID_REQUIRED", {
  message: "Grade id is required",
});

export const gradeNotFoundError = error("GRADE_NOT_FOUND", {
  message: "Grade Not Found",
});

export const gradeNameExistsError = error("GRADE_NAME_EXISTS", {
  message: "Grade name is already exists",
});
