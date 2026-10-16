"use client";

import { Button } from "@/components/shadcn/button";
import { TypographyH2 } from "@/components/ui/typography";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { ISubject } from "@/features/subjects";
import SubjectDialog, { subjectCategories } from "@/components/dialog/subject-dialog";
import { IStreamListItem } from "@/features/streams";

export default function SubjectDetails({
  subject,
  streamsList,
}: {
  subject: ISubject;
  streamsList: IStreamListItem[];
}) {
  const [isAddingSubject, setIsAddingSubject] = useState(false);

  const category = subjectCategories.filter((cat) => cat.value === subject.category)[0].label;
  const streams = subject.streams.map((stream) => stream.name);
  return (
    <>
      <div className="mx-auto w-full max-w-5xl space-y-8 px-16 py-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <TypographyH2 className="mt-1 text-2xl">{subject.name}</TypographyH2>
            <p className="font-mono text-xs text-muted-foreground">{subject.code ?? "No subject code"}</p>
          </div>
          <Button variant="outline" onClick={() => setIsAddingSubject(true)}>
            <PencilIcon className="size-4" aria-hidden="true" />
            Edit subject
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4 border-y border-border py-4">
          <div>
            <p className="text-sm text-muted-foreground">Category</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">{category}</p>
          </div>
          {subject.streams.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground">Streams</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">{streams.join(", ")}</p>
            </div>
          )}
        </div>
      </div>
      <SubjectDialog streams={streamsList} data={subject} open={isAddingSubject} onOpenChange={setIsAddingSubject} />
    </>
  );
}
