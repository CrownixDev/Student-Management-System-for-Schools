import { Route } from "next";

export const APP_URLS = {
  dashboard: "/" as Route,
  auth: {
    login: "/login",
    deactivated: "/deactivated",
    forbidden: "/forbidden",
  } as Record<string, Route>,
  simpleNav: {
    students: "/grades" as Route,
    exams: {
      root: "/nav/exams",
    } as Record<string, Route>,
    setup: "/setup" as Route,
  },
};
