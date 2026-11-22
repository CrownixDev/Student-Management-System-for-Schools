import { error } from "@orpc/server";

export const mediumNameExistsError = error("MEDIUM_NAME_EXISTS", {
  message: "Medium name is already exists",
});

export const mediumIdRequiredError = error("MEDIUM_ID_REQUIRED", {
  message: "Medium id is required",
});

export const mediumNotFoundError = error("MEDIUM_NOT_FOUND", {
  message: "Medium not found",
});
