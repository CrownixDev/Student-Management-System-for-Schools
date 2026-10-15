import { Class } from "@/generated/prisma/client";

export type IClassListItem = {
  id: Class["id"];
  name: Class["name"];
  studentCount: number;
};

export type IClassList = IClassListItem[];
