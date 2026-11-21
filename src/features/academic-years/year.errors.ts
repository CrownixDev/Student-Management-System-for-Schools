import { error } from "@orpc/server";

export const yearIdRequiredError = error("YEAR_ID_REQUIRED", {
  message: "Year ID is required",
});

export const yearNotFoundError = error("YEAR_NOT_FOUND", {
  message: "Year not found",
});

export const activeYearNotFoundError = error("ACTIVE_YEAR_NOT_FOUND", {
  message: "No active years found. Please set a year as current before proceeding.",
});

export const yearNameAlreadyExistError = error("YEAR_NAME_EXISTS", {
  message: "Year name already exists",
});
