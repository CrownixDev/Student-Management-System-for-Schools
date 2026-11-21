import { error } from "@orpc/server";

export const batchTypeRequiredError = error("BATCH_TYPE_REQUIRED", {
  message: "Batch type is required",
});

export const batchIdRequiredError = error("BATCH_ID_REQUIRED", {
  message: "Batch id is required",
});

export const batchNotFoundError = error("BATCH_NOT_FOUND", {
  message: "Batch not found",
});

export const batchNameExistsError = error("BATCH_NAME_EXISTS", {
  message: "Batch name is already exists",
});
