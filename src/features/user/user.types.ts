import { SubjectCategory } from "@/generated/prisma/enums";
import { UserGetPayload, UserSelect } from "@/generated/prisma/models";
import { StrictOmit } from "@/lib/utils";

export const userSelect = {
  id: true,
  username: true,
  role: true,
  isActive: true,
  teacher: { select: { id: true, fullName: true, phone: true } },
  userClasses: { select: { class: { select: { id: true, name: true } } } },
  userSubjects: { select: { subject: { select: { id: true, name: true, code: true, category: true } } } },
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
  "userSubjects" | "userClasses"
> & {
  classes: UserClass[];
  subjects: UserSubject[];
};
