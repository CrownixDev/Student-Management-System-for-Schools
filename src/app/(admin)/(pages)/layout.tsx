import { SidebarProvider } from "@/components/shadcn/sidebar";

export default function AdminLayout({ children }: LayoutProps<"/">) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
