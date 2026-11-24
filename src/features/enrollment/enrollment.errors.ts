import { error } from "@orpc/server";

export const studentAlreadyEnrolledError = error("STUDENT_ALREADY_ENROLLED", {
  message: "Student already enrolled this class",
});

export const classIdRequiredError = error("CLASS_ID_REQUIRED", {
  message: "Class id required",
});

export const stundetIdRequiredError = error("STUDENT_ID_REQUIRED", {
  message: "Student id required",
});

export const enrollmentNotFoundError = error("ENROLLMENT_NOT_FOUND", {
  message: "Enrollment not found",
});

export const classSubjectNotFoundError = error("CLASS_SUBJECT_NOT_FOUND", {
  message: "Class subject not found",
});

export const subjectInUseError = error("SUBJECT_IN_USE", {
  message: "This subject is currently in use",
});


