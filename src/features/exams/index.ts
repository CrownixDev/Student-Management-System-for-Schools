import { enrollmentRepository } from "../enrollment";
import { ExamRepository } from "./exams.repository";
import { ExamService } from "./exams.service";

export const examRepository = new ExamRepository();
export const examService = new ExamService(examRepository, enrollmentRepository);

export * from "./exams.types";
