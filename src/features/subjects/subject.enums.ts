import { SubjectCategory } from "@/generated/prisma/enums";

export const subjectCategories = [
  { label: "Core", value: "core" },
  { label: "Religion", value: "religion" },
  { label: "O/L Basket", value: "ol_basket" },
  { label: "A/L Main", value: "al_main" },
  { label: "A/L Common", value: "al_common" },
  { label: "Other", value: "other" },
] satisfies { value: SubjectCategory; label: string }[];
