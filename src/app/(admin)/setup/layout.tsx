"use client";

import { Separator } from "@/components/shadcn/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/shadcn/sidebar";
import SidebarFooter from "@/components/ui/sidebar/sidebar-footer";
import { TypographyH1 } from "@/components/ui/typography";
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
} from "lucide-react";
import { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const sidebarItems = [
    { name: "Years", icon: CalendarsIcon, link: "/setup/years" },
    { name: "Grades", icon: GraduationCapIcon, link: "/setup/grades" },
    { name: "Classes", icon: BackpackIcon, link: "/setup/classes" },
    { name: "Students", icon: CircleUserIcon, link: "/setup/students" },
    { name: "Subjects", icon: LibraryBigIcon, link: "/setup/subjects" },
    { name: "Exams", icon: NotebookPenIcon, link: "/setup/exams" },
    { name: "Batch", icon: LinkIcon, link: "/setup/batch" },
    { name: "Teachers", icon: UsersIcon, link: "/setup/teachers" },
    { name: "Medium", icon: Languages, link: "/setup/medium" },
    { name: "Users", icon: KeyRoundIcon, link: "/setup/users" },
    { name: "Settings", icon: SettingsIcon, link: "/setup/settings" },
  ] as {
    name: string;
    icon: LucideIcon;
    link: Route;
  }[];

  return (
    <SidebarProvider>
      <Sidebar collapsible="none" className="w-[14rem] h-screen border-r border-sidebar-border">
        <SidebarHeader>
          <TypographyH1>Setup</TypographyH1>
          <Separator />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.link);
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton isActive={isActive} render={<Link href={item.link} />}>
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
      <SidebarInset className="min-w-0">{children}</SidebarInset>
    </SidebarProvider>
  );
}
