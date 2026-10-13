import { ClassRepository } from "./class.repository";
import { ClassService } from "./class.service";

export const classRepository = new ClassRepository();
export const classService = new ClassService(classRepository);
export * from "./class.types";
