import { TypographyH1, TypographyH2 } from "@/components/ui/typography";
import { IAcademicYear } from "@/features/academic-years";
import { examService, IExamListItem } from "@/features/exams";
import { gradesService, IGradeListItem } from "@/features/grades";
import { GraduationCapIcon, NotebookPenIcon } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import ExamCard from "./exam-card";
import ExamNewBtn from "./button/exam-new-btn";
import { idCache } from "@/lib/nuqs/id";
import { redirect } from "next/navigation";
import { Separator } from "@/components/shadcn/separator";
import { getServerCaller } from "@/lib/orpc/server-caller";

export default async function ExamsDetails() {
  const caller = await getServerCaller();
  const gradeId = idCache.get("gradeId");

  let activeYear: IAcademicYear | null = null;
  let grade: IGradeListItem | null = null;
  let exams: IExamListItem[] = [];

  try {
    if (gradeId) grade = await gradesService.getListItemById(gradeId);
  } catch (err) {
    console.error("Failed to load grades:", err);
    redirect("/setup/exams");
  }

  try {
    activeYear = await caller.academicYear.getActiveYear();
  } catch (err) {
    console.error("Failed to load active year:", err);
    redirect("/setup");
  }

  if (gradeId) {
    try {
      exams = await examService.getList(gradeId);
    } catch (err) {
      console.error("Failed to load exams list:", err);
      redirect("/setup");
    }
  }

  if (!grade) {
    return (
      <EmptyState
        icon={GraduationCapIcon}
        title="No grade selected"
        description="Please select a grade from the sidebar to view its exams."
      />
    );
  }

  return (
    <main className="flex-1 overflow-y-auto mx-auto w-full max-w-5xl space-y-6 px-8 py-8">
      <header className="flex items-start justify-between gap-4">
        <TypographyH1>{grade.name}</TypographyH1>
        <ExamNewBtn year={activeYear} grade={grade} />
      </header>
      <Separator />
      <TypographyH2>
        All Exams <span className="font-mono text-muted-foreground">({exams.length})</span>
      </TypographyH2>
      <section>
        {exams.length > 0 && (
          <div className="space-y-4">
            {exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        )}

        {exams.length === 0 && (
          <EmptyState
            icon={NotebookPenIcon}
            title="No exams yet"
            description={`There are no exams for ${grade.name} in ${activeYear.name}.`}
          />
        )}
      </section>
    </main>
  );
}
