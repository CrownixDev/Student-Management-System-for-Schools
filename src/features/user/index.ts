import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

export * from "./user.types";
export const userRepository = new UserRepository();
export const userService = new UserService(userRepository);
