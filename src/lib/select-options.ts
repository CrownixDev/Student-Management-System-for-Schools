import { StudentStatus, UserRole } from "@/generated/prisma/enums";

export const genderSelectOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
] as const;

export const studentStatusSelectOptions = [
  { value: "active", label: "Active" },
  { value: "left", label: "Left" },
] satisfies ReadonlyArray<{ value: StudentStatus; label: string }>;

export const userRoleSelectOptions = [
  { value: "admin", label: "Admin" },
  { value: "mod", label: "Mod" },
  { value: "class_teacher", label: "Class Teacher" },
  { value: "subject_teacher", label: "Subject Teacher" },
] satisfies ReadonlyArray<{ value: UserRole; label: string }>;
