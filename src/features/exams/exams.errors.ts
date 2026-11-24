import { error } from "@orpc/server";

export const classNotFoundError = error("ClASS_NOT_FOUND",{
  message:"Class not found"
})

export const gradeIdRequiredError = error("GRADE_ID_REQUIRED", {
  message: "Grade id is required",
});

export const gradeNotFoundError = error("GRADE_NOT_FOUND", {
  message: "Grade not found",
});

export const examIdRequiredError = error("EXAM_ID_REQUIRED", {
  message: "Exam id is required",
});

export const examNameExistsError = error("EXAM_NAME_EXISTS",{
  message:"Exam name already exists"
})

export const examNotFoundError = error("EXAM_NOT_FOUND", {
  message: "Exam not found",
});

export const examSubjectIdRequiredError = error("EXAM_SUBJECT_ID_REQUIRED", {
  message: "Exam subject id is required",
});


export const examSubjectNotFoundError = error("EXAM_SUBJECT_NOT_FOUND", {
  message: "Exam subject not found",
});

export const enrollmentIdRequiredError = error("ENROLLMENT_ID_REQUIRED", {
  message: "Enrollment id is required",
});

export const enrollmentNotFoundError = error("ENROLLMENT_NOT_FOUND", {
  message: "Enrollment not found",
});

export const marksShouldBeFromCurrentYearsError = error("MARKS_NOT_IN_CURRENT_YEAR", {
  message: "You can only edit marks from active year",
});
