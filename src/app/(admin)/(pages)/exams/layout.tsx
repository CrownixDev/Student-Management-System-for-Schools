import { SidebarInset } from "@/components/shadcn/sidebar";

export default function layout({ sidebar, children }: LayoutProps<"/exams">) {
  return (
    <>
      {sidebar}
      <SidebarInset className="w-0 min-w-0">{children}</SidebarInset>
    </>
  );
}
