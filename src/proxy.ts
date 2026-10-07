import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth/constants";
import { clearAuthCookiesOnResponse, setAuthCookiesOnResponse } from "@/lib/auth/cookies";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { authService } from "@/features/auth";
import { APP_URLS } from "./constraints/url";

const PUBLIC_PATHS = ["/login"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

/**
 * Redirects the user to the specified pathname. Defaults to the login page.
 */
function redirectTo(request: NextRequest, pathname: string = APP_URLS.auth.login) {
  return NextResponse.redirect(new URL(pathname, request.url));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  if (accessToken) {
    try {
      await verifyAccessToken(accessToken);

      return NextResponse.next();
    } catch {
      // Access token expired/invalid.
    }
  }

  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    return redirectTo(request);
  }

  try {
    const result = await authService.refreshSession(refreshToken);

    if (!result.active) {
      const response = redirectTo(request, APP_URLS.auth.deactivated);
      clearAuthCookiesOnResponse(response);
      return response;
    }

    if (!result.accessToken || !result.refreshToken) {
      const response = redirectTo(request, APP_URLS.auth.login);
      clearAuthCookiesOnResponse(response);
      return response;
    }

    // Update the current request cookies

    request.cookies.set({
      name: ACCESS_TOKEN_COOKIE,
      value: result.accessToken,
    });

    request.cookies.set({
      name: REFRESH_TOKEN_COOKIE,
      value: result.refreshToken,
    });

    const requestHeaders = new Headers(request.headers);

    requestHeaders.set("cookie", request.cookies.toString());

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    // Update the browser's actual cookies.

    setAuthCookiesOnResponse(response, {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

    return response;
  } catch {
    const response = redirectTo(request);
    clearAuthCookiesOnResponse(response);
    return response;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
