import { error } from "@orpc/server";

export const invalidDataProvidedError = error("INVALID_DATA_PROVIDED", {
  message: "Invalid Data Provided",
});

export const recordInUseError = error("RECORD_IN_USE", {
  message:
    "This record cannot be deleted because it is currently referenced by other records in the system. Please remove those references before attempting to delete this record.",
});
