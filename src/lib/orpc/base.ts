import { getAuthPayload } from "../auth/authenticate";
import { os } from "@orpc/server";

export type ORPCContext = {
  headers: Headers;
};

const base = os.$context<ORPCContext>();

export const publicProcedure = base;

export const protectedProcedure = publicProcedure
  .errors({ UNAUTHORIZED: { message: "Authentication required" } })
  .use(async ({ next, errors }) => {
    const user = await getAuthPayload();

    if (!user) {
      throw errors.UNAUTHORIZED();
    }

    return next({ context: { user } });
  });
