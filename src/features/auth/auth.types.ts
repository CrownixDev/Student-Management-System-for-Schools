import { User } from "@/generated/prisma/client";
import { UserGetPayload, UserSelect } from "@/generated/prisma/models";

export interface ILoginData {
  username: string;
  password: string;
}

export interface IUserRegisterData {
  username: User["username"];
  password: string;
}

export const authUserSelect = {
  id: true,
  username: true,
  role: true,
  isActive: true,
} satisfies UserSelect;

export type IAuthResponseUser = UserGetPayload<{
  select: typeof authUserSelect;
}>;
