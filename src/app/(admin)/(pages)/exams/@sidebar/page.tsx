import { Sidebar, SidebarFooter } from "@/components/shadcn/sidebar";
import { buttonVariants } from "@/components/shadcn/button";
import { idCache } from "@/lib/nuqs/id";
import { HomeIcon } from "lucide-react";
import { Separator } from "@/components/shadcn/separator";
import { redirect } from "next/navigation";
import { academicYearsService, IAcademicYearListItem } from "@/features/academic-years";
import { gradesService, IGradeListItemForYear } from "@/features/grades";
import { classService, IClassList } from "@/features/class";
import { examService, IExamListItem } from "@/features/exams";
import SidebarGradeContent from "@/components/exams/sidebar-grade-content";
import SidebarClassContent from "@/components/exams/sidebar-class-content";
import SidebarExamContent from "@/components/exams/sidebar-exam-content";
import Link from "next/link";

export default async function page({ searchParams }: PageProps<"/exams">) {
  const { yearId, gradeId, classId, examId } = await idCache.parse(searchParams);

  const awaitedParams = await searchParams;
  const isViewing = awaitedParams.type === "view";

  let yearData: IAcademicYearListItem | null = null;
  let gradeList: IGradeListItemForYear[] = [];
  let classList: IClassList | null = null;
  let examList: IExamListItem[] | null = null;

  try {
    if (yearId) yearData = await academicYearsService.getListItemById(yearId);
    if (yearId) gradeList = await gradesService.getListByYear(yearId);
    if (yearId && gradeId) classList = await classService.getList(yearId, gradeId);
    if (yearId && gradeId) examList = await examService.getList(yearId, gradeId);
  } catch {
    redirect("/");
  }

  if (!yearData) {
    redirect("/");
  }

  const selectedClassItem = classList?.find((classItem) => classItem.id === classId);
  const selectedGradeItem = gradeList?.find((gradeItem) => gradeItem.id === gradeId);

  const hasGrade = !!gradeId;
  const hasClass = !!classId;
  const hasExam = !!examId;

  const showGrades = !hasGrade && !hasClass && !hasExam;
  const showClasses = hasGrade && !hasClass && !hasExam && !!selectedGradeItem && !isViewing;
  const showExams = hasGrade && !!examList && !!selectedGradeItem && ((hasClass && !!selectedClassItem) || isViewing);

  const renderSidebarContent = () => {
    if (showGrades) {
      return <SidebarGradeContent year={yearData} grades={gradeList} />;
    }

    if (showClasses) {
      return <SidebarClassContent year={yearData} gradeItem={selectedGradeItem!} classList={classList!} />;
    }

    if (showExams) {
      return (
        <SidebarExamContent
          year={yearData}
          gradeItem={selectedGradeItem!}
          classItem={selectedClassItem}
          examList={examList!}
        />
      );
    }

    return null;
  };

  return (
    <Sidebar collapsible="offcanvas" className="sticky top-0 h-screen">
      {renderSidebarContent()}
      <SidebarFooter>
        <Link href={"/"} className={buttonVariants({ variant: "outline" })}>
          <HomeIcon />
          Go Home
        </Link>
        <Separator />
        <p className="text-xs text-sidebar-foreground/60 text-center">A Project by CROWNIX</p>
      </SidebarFooter>
    </Sidebar>
  );
}
