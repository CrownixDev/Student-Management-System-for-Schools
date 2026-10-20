import { idCache } from "@/lib/nuqs/id";
import { redirect } from "next/navigation";
import { TypographyH2 } from "@/components/ui/typography";
import { subjectCategories } from "@/features/subjects/subject.enums";
import { ISubject, subjectService } from "@/features/subjects";
import { BookOpenCheckIcon } from "lucide-react";
import SubjectEditBtn from "./subject-edit-btn";
import EmptyState from "@/components/ui/empty-state";

export default async function SubjectDetails() {
  const subjectId = idCache.get("subjectId");
  let subject: ISubject | null = null;

  try {
    if (subjectId) subject = await subjectService.getById(subjectId);
  } catch {
    redirect("/setup/subjects");
  }

  if (!subject) {
    return (
      <EmptyState
        icon={BookOpenCheckIcon}
        title="Select a subject"
        description="Choose a subject from the list to see its class, teacher, and exam assignments."
      />
    );
  }

  const category = subjectCategories.filter((cat) => cat.value === subject.category)[0].label;

  return (
    <>
      <div className="mx-auto w-full max-w-5xl space-y-8 px-16 py-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <TypographyH2 className="mt-1 text-2xl">{subject.name}</TypographyH2>
            <p className="font-mono text-xs text-muted-foreground">{subject.code ?? "No subject code"}</p>
          </div>
          <SubjectEditBtn subject={subject} />
        </div>
        <div className="grid grid-cols-3 gap-4 border-y border-border py-4">
          <div>
            <p className="text-sm text-muted-foreground">Category</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">{category}</p>
          </div>
        </div>
      </div>
    </>
  );
}
