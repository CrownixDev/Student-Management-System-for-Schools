import { teachersRepository } from "@/features/teachers";
import TeacherDetails from "./teacher-details";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import PageLoading from "@/components/ui/page-loading";

async function Teacher({ teacherId }: { teacherId: string }) {
  const teacher = await teachersRepository.getById(teacherId);
  if (!teacher) redirect("/teachers");
  return <TeacherDetails teacher={teacher} />;
}

export default async function page({ params }: PageProps<"/teachers/[teacherId]">) {
  const { teacherId } = await params;

  return (
    <Suspense fallback={<PageLoading />}>
      <Teacher teacherId={teacherId} />
    </Suspense>
  );
}
