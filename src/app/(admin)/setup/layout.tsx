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
import { getActiveAcademicYearAction } from "@/features/academic-years/year.actions";
import { ACTIVE_YEAR } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarsIcon,
  CircleUserIcon,
  HousesIcon,
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
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

export default function SetupLayout({ children }: LayoutProps<"/setup">) {
  const pathname = usePathname();

  const { data: activeYear = null, isPending: isLoadingYear } = useQuery({
    queryFn: async () => {
      const res = await getActiveAcademicYearAction();
      if (res.success) {
        return res.data;
      } else {
        toast.error(res.message);
        return null;
      }
    },
    queryKey: [ACTIVE_YEAR],
  });

  const sidebarItems = [
    { name: "Years", icon: CalendarsIcon, link: "/setup/years", disabled: isLoadingYear },
    { name: "Classes", icon: HousesIcon, link: "/setup/classes", disabled: isLoadingYear || !activeYear },
    { name: "Exams", icon: NotebookPenIcon, link: "/setup/exams", disabled: isLoadingYear || !activeYear },
    { name: "Students", icon: CircleUserIcon, link: "/setup/students", disabled: isLoadingYear },
    { name: "Batch", icon: LinkIcon, link: "/setup/batch", disabled: isLoadingYear },
    { name: "Subjects", icon: LibraryBigIcon, link: "/setup/subjects", disabled: isLoadingYear },
    { name: "Teachers", icon: UsersIcon, link: "/setup/teachers", disabled: isLoadingYear },
    { name: "Medium", icon: Languages, link: "/setup/medium", disabled: isLoadingYear },
    { name: "Users", icon: KeyRoundIcon, link: "/setup/users", disabled: isLoadingYear },
    { name: "Settings", icon: SettingsIcon, link: "/setup/settings", disabled: isLoadingYear },
  ] as {
    name: string;
    icon: LucideIcon;
    link: Route;
    disabled?: boolean;
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
                      <SidebarMenuButton
                        disabled={item.disabled}
                        aria-disabled={item.disabled}
                        isActive={isActive}
                        render={<Link href={item.link} />}
                      >
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
