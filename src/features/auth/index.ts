import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";

export const authRepository = new AuthRepository();
export const authService = new AuthService(authRepository);
export * from "./auth.types";
