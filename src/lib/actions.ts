"use server";

import { revalidatePath } from "next/cache";
import { Route } from "next";

/**
 * This is used to revalidate a path from clientside.
 * @param path The path to revalidate
 */
export async function revalidateCache(path: Route) {
  revalidatePath(path);
}
