import { SidebarInset, SidebarProvider } from "@/components/shadcn/sidebar";
import TeachersSidebar from "./teachers-sidebar";
import { teachersRepository } from "@/features/teachers";

export default async function teachersLayout({ children }: { children: React.ReactNode }) {
  const teacherList = await teachersRepository.getList();
  return (
    <SidebarProvider>
      <TeachersSidebar teacherList={teacherList} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
