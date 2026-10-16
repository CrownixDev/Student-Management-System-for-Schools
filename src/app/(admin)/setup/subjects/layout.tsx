import SubjectSidebar from "./subject-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/shadcn/sidebar";
import { subjectRepository } from "@/features/subjects";

export default async function SubjectLayout({ children }: { children: React.ReactNode }) {
  const subjectList = await subjectRepository.getList();
  return (
    <SidebarProvider>
      <SubjectSidebar subjectList={subjectList} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}