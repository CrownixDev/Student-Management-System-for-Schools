import z from "zod";
import { IUserRegisterData } from "./auth.types";

export const userRegisterSchema = z.object({
  username: z.string("Username is required").min(3, "Username must be at least 3 characters long"),
  password: z.string("Password is required").min(6, "Password must be at least 6 characters long"),
} satisfies Record<keyof IUserRegisterData, z.ZodType>);
