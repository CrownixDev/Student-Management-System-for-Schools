import { Route } from "next";

export const APP_URLS = {
  dashboard: "/" as Route,
  auth: {
    login: "/login",
    deactivated: "/deactivated",
    forbidden: "/forbidden",
  } as Record<string, Route>,
};
