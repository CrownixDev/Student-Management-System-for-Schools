import "server-only";

import { headers } from "next/headers";
import { createRouterClient } from "@orpc/server";

import { router } from "./router";

export async function getServerCaller() {
  const requestHeaders = new Headers(await headers());

  return createRouterClient(router, {
    context: {
      headers: requestHeaders,
    },
  });
}
