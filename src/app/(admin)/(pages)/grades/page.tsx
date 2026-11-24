import { IAcademicYear } from "@/features/academic-years";
import { IBatch } from "@/features/batch";
import { IGradeListItemForYear } from "@/features/grades";
import { getServerCaller } from "@/lib/orpc/server-caller";
import { SidebarInset } from "@/components/shadcn/sidebar";
import { redirect } from "next/navigation";
import { idCache } from "@/lib/nuqs/id";
import GradesSidebar from "./grades-sidebar";
import GradesPage from "./grades-page";

export default async function page({ searchParams }: PageProps<"/grades">) {
  const { yearId, batchId } = await idCache.parse(searchParams);
  const caller = await getServerCaller();

  let yearData: IAcademicYear | null = null;
  let batchData: IBatch | null = null;
  let gradelist: IGradeListItemForYear[] = [];

  try {
    if (yearId) {
      yearData = await caller.academicYear.getListItemById({ id: yearId });
      gradelist = await caller.grade.getList({ yearId, search: null });
    }
    if (batchId) batchData = await caller.batch.getById({ id: batchId });
  } catch {
    redirect("/");
  }

  if ((!yearData && !batchData) || !gradelist) {
    redirect("/");
  }

  return (
    <>
      <GradesSidebar grades={gradelist} year={yearData} batch={batchData} />
      <SidebarInset>
        <GradesPage />
      </SidebarInset>
    </>
  );
}
