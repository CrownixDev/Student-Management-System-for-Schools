import { SidebarInset } from "@/components/shadcn/sidebar";

export default function Layout({ sidebar, children }: { sidebar: React.ReactNode; children: React.ReactNode }) {
  return (
    <>
      {sidebar}
      <SidebarInset>{children}</SidebarInset>
    </>
  );
}
