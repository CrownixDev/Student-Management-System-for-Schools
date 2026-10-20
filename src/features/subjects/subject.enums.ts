import { SubjectCategory } from "@/generated/prisma/enums";

export const subjectCategories = [
  { label: "A/L Main", value: "al_main" },
  { label: "A/L Common", value: "al_common" },
  { label: "Core", value: "core" },
  { label: "O/L Basket", value: "ol_basket" },
  { label: "Religion", value: "religion" },
  { label: "Other", value: "other" },
] satisfies { value: SubjectCategory; label: string }[];
