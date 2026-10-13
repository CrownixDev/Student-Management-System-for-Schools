import { Class } from "@/generated/prisma/client";

export type IClassList = {
  id: Class["id"];
  name: Class["name"];
  studentCount: number;
}[];
