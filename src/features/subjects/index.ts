import { SubjectRepository } from "./subject.repository";
import { SubjectService } from "./subject.service";

export const subjectRepository = new SubjectRepository();
export const subjectService = new SubjectService(subjectRepository);
export * from "./subject.types";
