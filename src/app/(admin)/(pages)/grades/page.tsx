import { academicYearsService, IAcademicYear } from "@/features/academic-years";
import { batchService, IBatch } from "@/features/batch";
import { gradesService, IGradeListItemForYear } from "@/features/grades";
import { SidebarInset } from "@/components/shadcn/sidebar";
import { redirect } from "next/navigation";
import { idCache } from "@/lib/nuqs/id";
import GradesSidebar from "./grades-sidebar";
import GradesPage from "./grades-page";

export default async function page({ searchParams }: PageProps<"/grades">) {
  const { yearId, batchId } = await idCache.parse(searchParams);

  let yearData: IAcademicYear | null = null;
  let batchData: IBatch | null = null;
  let gradelist: IGradeListItemForYear[] = [];

  try {
    if (yearId) {
      yearData = await academicYearsService.getListItemById(yearId);
      gradelist = await gradesService.getListByYear(yearId);
    }
    if (batchId) batchData = await batchService.getById(batchId);
  } catch {
    redirect("/nav/student");
  }

  if ((!yearData && !batchData) || !gradelist) {
    redirect("/nav/student");
  }

  return (
    <>
      <GradesSidebar gradeList={gradelist} year={yearData} batch={batchData} />
      <SidebarInset>
        <GradesPage />
      </SidebarInset>
    </>
  );
}
