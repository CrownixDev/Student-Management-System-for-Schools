import { SidebarInset } from "@/components/shadcn/sidebar";

export default function layout({ sidebar, children }: LayoutProps<"/exams">) {
  return (
    <>
      {sidebar}
      <SidebarInset>{children}</SidebarInset>
    </>
  );
}
