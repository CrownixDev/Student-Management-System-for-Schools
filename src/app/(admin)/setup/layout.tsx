import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/shadcn/sidebar";
import SidebarFooter from "@/components/ui/sidebar/sidebar-footer";
import {
  BackpackIcon,
  CalendarsIcon,
  CircleUserIcon,
  GraduationCapIcon,
  KeyRoundIcon,
  Languages,
  LibraryBigIcon,
  LinkIcon,
  LucideIcon,
  NotebookPenIcon,
  SettingsIcon,
  UsersIcon,
  WaypointsIcon,
} from "lucide-react";
import { Route } from "next";
import Link from "next/link";

export default function layout({ children }: LayoutProps<"/">) {
  const sidebarItems = [
    { name: "Years", icon: CalendarsIcon, link: "/setup/teachers" },
    { name: "Grades", icon: GraduationCapIcon, link: "/setup/teachers" },
    { name: "Classes", icon: BackpackIcon, link: "/setup/teachers" },
    { name: "Students", icon: CircleUserIcon, link: "/setup/teachers" },
    { name: "Subjects", icon: LibraryBigIcon, link: "/setup/subjects" },
    { name: "Exams", icon: NotebookPenIcon, link: "/setup/subjects" },
    { name: "Streams", icon: WaypointsIcon, link: "/setup/teachers" },
    { name: "Batch", icon: LinkIcon, link: "/setup/teachers" },
    { name: "Teachers", icon: UsersIcon, link: "/setup/teachers" },
    { name: "Medium", icon: Languages, link: "/setup/teachers" },
    { name: "Users", icon: KeyRoundIcon, link: "/setup/teachers" },
    { name: "Settings", icon: SettingsIcon, link: "/setup/settings" },
  ] as {
    name: string;
    icon: LucideIcon;
    link: Route;
  }[];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton render={<Link href={item.link} />}>
                        <Icon />
                        <span>{item.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
