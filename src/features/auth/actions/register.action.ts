"use server";

import { authService, IUserRegisterData } from "@/features/auth";
import { ApiError } from "@/lib/ApiError";
import { setAuthCookies } from "@/lib/auth/cookies";

export async function registerAction(registerData: IUserRegisterData) {
  try {
    const { accessToken, refreshToken } = await authService.registerAdmin(registerData);

    if (!refreshToken || !accessToken) {
      return { success: false, message: "Something went wrong" };
    }

    await setAuthCookies({ accessToken, refreshToken });

    return { success: true, message: "Account created successfully" };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message };
    }
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
}
