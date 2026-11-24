import { IAcademicYear } from "@/features/academic-years";
import { IGradeListItemForYear } from "@/features/grades";
import { classService, IClassList } from "@/features/class";
import { IExamListItem } from "@/features/exams";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/shadcn/sidebar";
import { idCache } from "@/lib/nuqs/id";
import { getServerCaller } from "@/lib/orpc/server-caller";
import SidebarGradeContent from "@/components/pages/exams/sidebar/sidebar-grade-content";
import SidebarClassContent from "@/components/pages/exams/sidebar/sidebar-class-content";
import SidebarExamContent from "@/components/pages/exams/sidebar/sidebar-exam-content";
import AppSidebarFooter from "@/components/ui/sidebar/sidebar-footer";

export default async function page({ searchParams }: PageProps<"/exams">) {
  const { yearId, gradeId, classId, examId } = await idCache.parse(searchParams);
  const caller = await getServerCaller();

  const awaitedParams = await searchParams;
  const isViewing = awaitedParams.type === "view";

  let yearData: IAcademicYear | null = null;
  let gradeList: IGradeListItemForYear[] = [];
  let classList: IClassList | null = null;
  let examList: IExamListItem[] | null = null;

  try {
    if (yearId) yearData = await caller.academicYear.getListItemById({ id: yearId });
    if (yearId) gradeList = await caller.grade.getList({ yearId, search: null });
    if (gradeId) classList = await classService.getList(gradeId);
    if (gradeId) examList = await caller.exam.getList({ gradeId });
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
      return <SidebarGradeContent grades={gradeList} />;
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
    <Sidebar collapsible="offcanvas">
      {renderSidebarContent()}
      <AppSidebarFooter />
    </Sidebar>
  );
}
