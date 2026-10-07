"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { REFRESH_TOKEN_COOKIE } from "@/lib/auth/constants";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { authService } from "@/features/auth";
import { APP_URLS } from "@/constraints/url";

export async function logoutAction() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (refreshToken) {
    await authService.logOut(refreshToken);
  }

  await clearAuthCookies();
  redirect(APP_URLS.auth.login);
}
