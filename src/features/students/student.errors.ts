import { error } from "@orpc/server";

export const studentIdRequiredError = error("STUDENT_ID_REQUIRED", {
  message: "Student ID required",
});

export const classIdRequiredError = error("CLASS_ID_REQUIRED", {
  message: "Class ID required",
});

export const classAndStudentIdRequiredError = error("CLASS_STUDENT_IDS_REQUIRED", {
  message: "Class and student IDs are required",
});

export const studentNotFoundError = error("STUDENT_NOT_FOUND", {
  message: "Student not found",
});

export const admissionNumberExistsError = error("ADMISSION_NUMBER_EXISTS", {
  message: "Admission number is already exists",
});

export const customFieldNameExistsError = error("FIELD_NAME_EXISTS", {
  message: "A custom field with this name already exists",
});

export const customFieldIdRequiredError = error("FIELD_ID_REQUIRED", {
  message: "CustomField id is required",
});

export const customFieldNotFoundError = error("FIELD_NOT_FOUND", {
  message: "Custom field not found",
});

export const changeTextToDateError = error("TEXT_FIELD_TO_DATE_FIELD", {
  message: "You cannot change the type of a text field to date field",
});

export const changeDateToTextError = error("DATE_FIELD_TO_TEXT_FIELD", {
  message: "You cannot change the type of a date field to text field",
});
