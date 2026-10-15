import { Route } from "next";

export const APP_URLS = {
  dashboard: "/",
  auth: {
    login: "/login",
    deactivated: "/deactivated",
    forbidden: "/forbidden",
  } as Record<string, Route>,
  simpleNav: {
    student: {
      root: "/nav/student",
      year: "/nav/student/year",
      batch: "/nav/student/batch",
    } as Record<string, Route>,
    exams: {
      root: "/nav/exams",
    } as Record<string, Route>,
    setup: {
      root: "/nav/setup",
      teacher: "/teachers",
      subjects: "/subjects",
      streams: "/streams",
      grades: "/grades",
    } as Record<string, Route>,
    settings: "nav/settings",
  },
};
