import { Gender, StudentStatus } from "@/generated/prisma/enums";
import { StudentCreateInput } from "@/generated/prisma/models";
import z from "zod";

export const studentSchema = z.object({
  admissionNo: z
    .string("Admission number is required")
    .min(1, "Admission number should be longer than 1 character")
    .max(20, "Admission number cannot be longer than 20 characters"),
  fullName: z
    .string("Name is required")
    .min(3, "Student name must be at least 3 characters long")
    .max(100, "Student name cannot be longer than 100 characters"),
  dob: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.iso.date().optional(),
  ),
  gender: z.enum(["male", "female"] satisfies Gender[]).optional(),
  nic: z.string().max(20, "NIC cannot be longer than 20 characters").optional(),
  phone: z.string().max(10, "Invalid phone number").optional(),
  address: z.string().max(200, "Student address cannot be longer than 200 characters").optional(),
  guardianName: z.string("Name is required").max(100, "Guardian name cannot be longer than 100 characters").optional(),
  guardianPhone: z.string().max(10, "Invalid phone number").optional(),
  status: z.enum(["active", "left"] satisfies StudentStatus[]),
} satisfies Partial<Record<keyof StudentCreateInput, z.ZodType>>);
