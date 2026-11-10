import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_COOKIE_MAX_AGE,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE_MAX_AGE,
} from "./constants";
import { NextResponse } from "next/server";

const isSecure = process.env.SECURE;

if (isSecure !== undefined && isSecure !== "true" && isSecure !== "false") {
  throw new Error('SECURE must be "true" or "false"');
}

const commonCookieOptions = {
  httpOnly: true,
  secure: isSecure === "true",
  sameSite: "lax" as const,
  path: "/",
};

export function setAuthCookiesOnResponse(
  response: NextResponse,
  { accessToken, refreshToken }: { accessToken: string; refreshToken: string },
) {
  response.cookies.set({
    name: ACCESS_TOKEN_COOKIE,
    value: accessToken,
    ...commonCookieOptions,
    maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE,
  });

  response.cookies.set({
    name: REFRESH_TOKEN_COOKIE,
    value: refreshToken,
    ...commonCookieOptions,
    maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
  });
}

export function clearAuthCookiesOnResponse(response: NextResponse) {
  response.cookies.set({
    name: ACCESS_TOKEN_COOKIE,
    value: "",
    ...commonCookieOptions,
    maxAge: 0,
  });

  response.cookies.set({
    name: REFRESH_TOKEN_COOKIE,
    value: "",
    ...commonCookieOptions,
    maxAge: 0,
  });
}

export async function setAuthCookies({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: ACCESS_TOKEN_COOKIE,
    value: accessToken,
    ...commonCookieOptions,
    maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE,
  });

  cookieStore.set({
    name: REFRESH_TOKEN_COOKIE,
    value: refreshToken,
    ...commonCookieOptions,
    maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.set({
    name: ACCESS_TOKEN_COOKIE,
    value: "",
    ...commonCookieOptions,
    maxAge: 0,
  });

  cookieStore.set({
    name: REFRESH_TOKEN_COOKIE,
    value: "",
    ...commonCookieOptions,
    maxAge: 0,
  });
}
