import { ISubject, subjectService } from "@/features/subjects";
import { redirect } from "next/navigation";
import SubjectDetails from "../../../../components/setup/subjects/subject.details";
import { IStreamListItem, streamRepository } from "@/features/streams";
import { idCache } from "@/lib/nuqs/id";
import { BookOpenCheckIcon } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import SubjectSidebar from "@/components/setup/subjects/sidebar/subject-sidebar";
import { filterCache } from "@/lib/nuqs/filter";

export default async function page({ searchParams }: PageProps<"/setup/subjects">) {
  const { subjectId } = await idCache.parse(searchParams);
  const { search, page, limit } = await filterCache.parse(searchParams);

  let subject: ISubject | null = null;
  let streams: IStreamListItem[] | null = null;

  try {
    if (subjectId) subject = await subjectService.getById(subjectId);
    streams = await streamRepository.getList();
  } catch {
    redirect("/setup/subjects");
  }

  const subjectListRes = await subjectService.getList({ search, page, limit });
  return (
    <div className="flex w-full h-screen">
      <SubjectSidebar isQuery={!!search} itemCount={subjectListRes.count} subjectList={subjectListRes.list} />

      {subject && <SubjectDetails subject={subject} streamsList={streams} />}

      {!subject && (
        <EmptyState
          icon={BookOpenCheckIcon}
          title="Select a subject"
          description="Choose a subject from the list to see its class, teacher, and exam assignments."
        />
      )}
    </div>
  );
}
