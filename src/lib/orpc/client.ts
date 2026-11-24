"use client";

import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { AppRouter } from "./router";

const link = new RPCLink({ url: "/api/rpc" });

export const rpcClient: RouterClient<AppRouter> = createORPCClient(link);
export const rpcTanStack = createTanstackQueryUtils(rpcClient);
