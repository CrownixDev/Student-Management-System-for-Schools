"use client";

import { BatchType } from "@/generated/prisma/enums";
import { useQueryStates } from "nuqs";
import { TabsTrigger } from "@/components/shadcn/tabs";
import { batchTabParsers } from "@/features/batch/batch.cache";

export default function BatchTableTabBtn({ children, value }: { children: React.ReactNode; value: BatchType }) {
  const [_, setPartsers] = useQueryStates(batchTabParsers);

  return (
    <TabsTrigger onClick={() => setPartsers({ tab: value })} value={value}>
      {children}
    </TabsTrigger>
  );
}
