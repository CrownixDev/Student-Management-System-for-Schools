import { StudentStatus } from "@/generated/prisma/enums";

export const genderSelectOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
] as const;

export const studentStatusSelectOptions = [
  { value: "active", label: "Active" },
  { value: "left", label: "Left" },
] satisfies ReadonlyArray<{ value: StudentStatus; label: string }>;
