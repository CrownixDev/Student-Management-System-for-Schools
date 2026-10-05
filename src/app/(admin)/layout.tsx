import { AppSidebar } from "@/components/ui/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/shadcn/sidebar";
import Navbar from "@/components/ui/navbar/navbar";

export default function AdminLayout({ children }: LayoutProps<"/">) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
