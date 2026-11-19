import { AuthPayload } from "@/lib/auth/authenticate";
import { UserRole } from "@/generated/prisma/enums";
import { os } from "@orpc/server";

/**
 ** A middleware to guard routes based on user roles.
 ** only use this after `protectedProcedure`
 */
export const roleGuard = os
  .$context<{ user?: AuthPayload }>()
  .errors({
    UNAUTHORIZED: { message: "Authentication required" },
    FORBIDDEN: { message: "You do not have permission to perform this action" },
  })
  .middleware(async ({ context, next, errors }, input: UserRole[]) => {
    if (!context.user) {
      throw errors.UNAUTHORIZED();
    }
    if (context.user.role === "admin") {
      return next();
    }
    if (input.includes(context.user.role)) {
      return next();
    }
    throw errors.FORBIDDEN();
  });
