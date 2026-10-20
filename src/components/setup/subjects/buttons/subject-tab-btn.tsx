"use client";

import { SubjectCategory } from "@/generated/prisma/enums";
import { useQueryStates } from "nuqs";
import { TabsTrigger } from "@/components/shadcn/tabs";
import { subjectTabParsers } from "@/features/subjects/batch.cache";

export default function SubjectTabBtn({ children, value }: { children: React.ReactNode; value: SubjectCategory }) {
  const [_, setPartsers] = useQueryStates(subjectTabParsers);

  return (
    <TabsTrigger onClick={() => setPartsers({ tab: value })} value={value}>
      {children}
    </TabsTrigger>
  );
}
