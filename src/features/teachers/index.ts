import { TeachersService } from "./teachers.service";
import { TeachersRepository } from "./teachers.repository";

export const teachersRepository = new TeachersRepository();
export const teachersService = new TeachersService(teachersRepository);
export * from "./teachers.types";
