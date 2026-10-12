import { StudentsService } from "./students.service";
import { StudentsRepository } from "./students.repository";

export const studentsRepository = new StudentsRepository();
export const studentsService = new StudentsService(studentsRepository);
export * from "./students.types";
