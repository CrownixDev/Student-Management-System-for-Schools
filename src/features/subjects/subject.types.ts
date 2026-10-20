import { SubjectGetPayload, SubjectSelect } from "@/generated/prisma/models";

export const subjectListSelect = {
  id: true,
  name: true,
  code: true,
  category: true,
} satisfies SubjectSelect;

export type ISubjectListItem = SubjectGetPayload<{
  select: typeof subjectListSelect;
}>;

export interface ISubjectList {
  list: ISubjectListItem[];
  count: number;
}

export const subjectSelect = {
  id: true,
  name: true,
  code: true,
  category: true,
  streams: { select: { id: true, name: true } },
} satisfies SubjectSelect;

export type ISubject = SubjectGetPayload<{
  select: typeof subjectSelect;
}>;
