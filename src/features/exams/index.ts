import { classRepository } from "../class";
import { enrollmentRepository } from "../enrollment";
import { gradesRepository } from "../grades";
import { ExamRepository } from "./exams.repository";
import { ExamService } from "./exams.service";

export const examRepository = new ExamRepository();
export const examService = new ExamService(examRepository, enrollmentRepository, gradesRepository, classRepository);

export * from "./exams.types";
