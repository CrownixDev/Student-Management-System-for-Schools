import { ITeacher, teachersService } from "@/features/teachers";
import { redirect } from "next/navigation";
import { idCache } from "@/lib/nuqs/id";
import { filterCache } from "@/lib/nuqs/filter";
import TeachersSidebar from "@/components/setup/teachers/sidebar/teachers-sidebar";
import TeacherDetails from "@/components/setup/teachers/teacher-details";
import EmptyState from "@/components/ui/empty-state";
import { UsersRoundIcon } from "lucide-react";

export default async function page({ searchParams }: PageProps<"/setup/teachers">) {
  const { search, page, limit } = await filterCache.parse(searchParams);
  const { teacherId } = await idCache.parse(searchParams);

  let teacher: ITeacher | null = null;

  try {
    if (teacherId) teacher = await teachersService.getById(teacherId);
  } catch {
    redirect("/setup/teachers");
  }

  const teacherListRes = await teachersService.getList({ search, limit, page });

  return (
    <div className="flex h-dvh">
      <TeachersSidebar isQuery={!!search} itemCount={teacherListRes.count} teacherList={teacherListRes.list} />

      {teacher && <TeacherDetails teacher={teacher} />}

      {!teacher && (
        <EmptyState
          icon={UsersRoundIcon}
          title="Select a teacher"
          description="Choose a teacher from the list to see their class and subject assignments."
        />
      )}
    </div>
  );
}
