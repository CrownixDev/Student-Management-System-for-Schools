import { AcademicYearCreateInput } from "@/generated/prisma/models";
import z from "zod";

export const academicYearSchema = z
  .object({
    name: z.string().min(4, "Please enter a valid year").max(4, "Please enter a valid year"),
    startDate: z.iso.date("Invalid date"),
    endDate: z.iso.date("Invalid date"),
  } satisfies Partial<Record<keyof AcademicYearCreateInput, z.ZodType>>)
  .refine((year) => year.endDate > year.startDate, {
    message: "End date must be later than start date",
    path: ["endDate"],
  });
