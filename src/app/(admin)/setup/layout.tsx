"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/shadcn/sidebar";
import {
  CalendarsIcon,
  CircleUserIcon,
  HousesIcon,
  KeyRoundIcon,
  Languages,
  LibraryBigIcon,
  LinkIcon,
  Loader2Icon,
  LucideIcon,
  NotebookPenIcon,
  SettingsIcon,
  TriangleAlertIcon,
  UsersIcon,
} from "lucide-react";
import { TypographyH1 } from "@/components/ui/typography";
import { usePathname } from "next/navigation";
import { rpcTanStack } from "@/lib/orpc/client";
import { Separator } from "@/components/shadcn/separator";
import { useQuery } from "@tanstack/react-query";
import { Route } from "next";
import SidebarFooter from "@/components/ui/sidebar/sidebar-footer";
import Link from "next/link";

export default function SetupLayout({ children }: LayoutProps<"/setup">) {
  const pathname = usePathname();

  const { data: activeYear = null, isPending: isLoadingYear } = useQuery(
    rpcTanStack.academicYear.getActiveYear.queryOptions({
      gcTime: 0,
      staleTime: 0,
    }),
  );

  const sidebarItems = [
    {
      name: "Years",
      icon: CalendarsIcon,
      link: "/setup/years",
      badge:
        !isLoadingYear && !activeYear ? (
          <SidebarMenuBadge>
            <TriangleAlertIcon color="red" size={15} />
          </SidebarMenuBadge>
        ) : null,
    },
    {
      name: "Classes",
      icon: HousesIcon,
      link: "/setup/classes",
      disabled: isLoadingYear || !activeYear,
      badge: isLoadingYear ? (
        <SidebarMenuBadge>
          <Loader2Icon size={15} className="animate-spin" />
        </SidebarMenuBadge>
      ) : null,
    },
    {
      name: "Exams",
      icon: NotebookPenIcon,
      link: "/setup/exams",
      disabled: isLoadingYear || !activeYear,
      badge: isLoadingYear ? (
        <SidebarMenuBadge>
          <Loader2Icon size={15} className="animate-spin" />
        </SidebarMenuBadge>
      ) : null,
    },
    { name: "Students", icon: CircleUserIcon, link: "/setup/students" },
    { name: "Batch", icon: LinkIcon, link: "/setup/batch" },
    { name: "Subjects", icon: LibraryBigIcon, link: "/setup/subjects" },
    { name: "Teachers", icon: UsersIcon, link: "/setup/teachers" },
    { name: "Medium", icon: Languages, link: "/setup/medium" },
    { name: "Users", icon: KeyRoundIcon, link: "/setup/users" },
    { name: "Settings", icon: SettingsIcon, link: "/setup/settings" },
  ] as {
    name: string;
    icon: LucideIcon;
    link: Route;
    disabled?: boolean;
    badge?: React.ReactNode;
  }[];

  return (
    <SidebarProvider>
      <Sidebar collapsible="none" className="w-56 h-screen border-r border-sidebar-border">
        <SidebarHeader>
          <Link href="/setup">
            <TypographyH1>Setup</TypographyH1>
          </Link>
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
                      {item.badge}
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
