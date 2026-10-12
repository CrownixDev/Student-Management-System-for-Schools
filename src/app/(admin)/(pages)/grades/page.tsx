import { SidebarInset } from "@/components/shadcn/sidebar";
import { gradesRepository } from "@/features/grades";
import { academicYearsRepository } from "@/features/academic-years";
import { idCache } from "@/lib/nuqs/id";
import { redirect } from "next/navigation";
import GradesSidebar from "./grades-sidebar";
import GradesPage from "./grades-page";

export default async function page({ searchParams }: PageProps<"/grades">) {
  const { yearId } = await idCache.parse(searchParams);

  const yearData = await academicYearsRepository.getListItemById(yearId ?? "");

  if (!yearData) {
    redirect("/nav/student/year");
  }

  const gradelist = await gradesRepository.getList();

  return (
    <>
      <GradesSidebar gradeList={gradelist} year={yearData} />
      <SidebarInset>
        <GradesPage />
      </SidebarInset>
    </>
  );
}
