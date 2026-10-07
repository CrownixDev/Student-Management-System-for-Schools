import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/ApiError";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "./constants";
import { clearAuthCookies, setAuthCookies } from "./cookies";
import { verifyAccessToken } from "./jwt";
import { authService } from "@/features/auth";
import { UserRole } from "@/generated/prisma/enums";
import { APP_URLS } from "@/constraints/url";

export type AuthPayload = {
  username: string;
  role: UserRole;
};

/**
 * Reads and verifies the access token only. No refreshing
 */
export async function getAuthPayload(): Promise<AuthPayload | null> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    return null;
  }

  try {
    const payload = await verifyAccessToken(accessToken);
    return {
      username: payload.sub,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

function checkRoles(user: AuthPayload, requiredRoles: UserRole[]): boolean {
  let hasAccess = false;

  if (user.role === "admin") {
    hasAccess = true;
  }

  if (requiredRoles.length === 0) {
    hasAccess = true;
  }

  if (requiredRoles.includes(user.role)) {
    hasAccess = true;
  }
  return hasAccess;
}

type RequireAuthType = {
  requiredRoles?: UserRole[];
};
/**
 * RSC authentication and authorization guard.
 * This will refresh the token using `proxy.ts`
 * and check whether the user has the required roles and permissions */
export async function requireAuthRSC({ requiredRoles = [] }: RequireAuthType): Promise<AuthPayload> {
  const user = await getAuthPayload();

  if (!user) {
    return redirect(APP_URLS.auth.login);
  }

  if (!checkRoles(user, requiredRoles)) {
    return redirect(APP_URLS.auth.forbidden);
  }

  return user;
}

export async function authenticateWithRefresh(): Promise<AuthPayload | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (accessToken) {
    try {
      const payload = await verifyAccessToken(accessToken);

      return {
        username: payload.sub,
        role: payload.role,
      };
    } catch {
      // Access token expired/invalid.
    }
  }

  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) return null;

  try {
    const result = await authService.refreshSession(refreshToken);

    if (!result.active || !result.accessToken || !result.refreshToken) {
      await clearAuthCookies();
      return null;
    }

    await setAuthCookies({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

    const payload = await verifyAccessToken(result.accessToken);
    return { username: payload.sub, role: payload.role };
  } catch {
    await clearAuthCookies();
    return null;
  }
}

/** Server Action authentication and authorization guard.
 *  This will refresh the token inside server actions
 *  and check whether the user has the required roles and permissions */
export async function requireAuthServerAction({ requiredRoles = [] }: RequireAuthType): Promise<AuthPayload> {
  const user = await authenticateWithRefresh();

  if (!user) {
    throw new ApiError(401, "Authentication required");
  }

  if (!checkRoles(user, requiredRoles)) {
    throw new ApiError(403, "You do not have permission to perform this action");
  }

  return user;
}
