"use server";

import { setAuthCookies } from "@/lib/auth/cookies";
import { authService } from "@/features/auth";
import { ApiError } from "@/lib/ApiError";

type LoginActionType = { success: boolean; message: string };

export async function loginAction(username: string, password: string): Promise<LoginActionType> {
  if (!username || !password) {
    return { success: false, message: "Username and Password are required" };
  }

  try {
    const { accessToken, refreshToken, active } = await authService.login({
      username,
      password,
    });

    if (!active) {
      return {
        success: false,
        message: "Your account is deactivated. Please contact support.",
      };
    }
    if (!refreshToken || !accessToken) {
      return { success: false, message: "Something went wrong" };
    }

    await setAuthCookies({ accessToken, refreshToken });

    return { success: true, message: "Login successful" };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Something went wrong" };
  }
}
