import { subjectRepository } from "@/features/subjects";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import SubjectDetails from "./subject.details";
import PageLoading from "@/components/ui/page-loading";
import { streamRepository } from "@/features/streams";

async function SubjectPage({ subjectId }: { subjectId: string }) {
  const subject = await subjectRepository.getById(subjectId);
  const streams = await streamRepository.getList();
  if (!subject) redirect("/setup/subjects");
  return <SubjectDetails subject={subject} streamsList={streams} />;
}

export default async function page({ params }: PageProps<"/setup/subjects/[subjectId]">) {
  const { subjectId } = await params;

  return (
    <Suspense fallback={<PageLoading />}>
      <SubjectPage subjectId={subjectId} />
    </Suspense>
  );
}
