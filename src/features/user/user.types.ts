import { SubjectCategory } from "@/generated/prisma/enums";
import { UserGetPayload, UserSelect } from "@/generated/prisma/models";
import { StrictOmit } from "@/lib/utils";

export const userSelect = {
  id: true,
  username: true,
  role: true,
  isActive: true,
  teacher: { select: { id: true, fullName: true, phone: true } },
  classes: { select: { class: { select: { id: true, name: true } } } },
  subjects: { select: { subject: { select: { id: true, name: true, code: true, category: true } } } },
} satisfies UserSelect;

type UserClass = {
  id: string;
  name: string;
};

type UserSubject = {
  id: string;
  name: string;
  code: string | null;
  category: SubjectCategory;
};

export type IUser = StrictOmit<
  UserGetPayload<{
    select: typeof userSelect;
  }>,
  "subjects" | "classes"
> & {
  classes: UserClass[];
  subjects: UserSubject[];
};
