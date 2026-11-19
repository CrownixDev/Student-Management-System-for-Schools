import { ORPCError, os } from "@orpc/server";
import { ApiErrorV2 } from "../ApiError";
import { authenticateWithRefresh } from "../auth/authenticate";

export type ORPCContext = {
  headers: Headers;
};

const base = os.$context<ORPCContext>();

export const publicProcedure = base.use(
  os.middleware(async ({ next }) => {
    try {
      return await next();
    } catch (error) {
      if (error instanceof ApiErrorV2) {
        throw new ORPCError("BAD_REQUEST", {
          message: error.message,
          cause: error,
        });
      }
      throw error;
    }
  }),
);

export const protectedProcedure = publicProcedure
  .errors({ UNAUTHORIZED: { message: "Authentication required" } })
  .use(async ({ next, errors }) => {
    const user = await authenticateWithRefresh();

    if (!user) {
      throw errors.UNAUTHORIZED();
    }

    return next({ context: { user } });
  });
