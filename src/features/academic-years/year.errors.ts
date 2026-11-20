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

export const invalidDataProvidedError = error("BAD_REQUEST", {
  message: "Invalid Data Provided",
});

export const yearNameAlreadyExistError = error("YEAR_NAME_EXISTS", {
  message: "Year name already exists",
});

export const yearUsingByOthersError = error("YEAR_CANT_DELETE", {
  message:
    "This year cannot be deleted because it is currently referenced by other records in the system. Please remove those references before attempting to delete this year.",
});
