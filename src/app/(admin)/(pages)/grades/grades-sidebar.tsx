import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcn/sidebar";
import { Button, buttonVariants } from "@/components/shadcn/button";
import { ArrowLeftIcon, GraduationCapIcon, HomeIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/shadcn/badge";
import { IGradeListItem } from "@/features/grades";
import { Empty, EmptyContent, EmptyMedia, EmptyTitle } from "@/components/shadcn/empty";
import { TypographyH1, TypographyH2 } from "@/components/ui/typography";
import { IAcademicYearListItem } from "@/features/academic-years";
import { Separator } from "@/components/shadcn/separator";
import { Route } from "next";

export default function GradesSidebar({
  gradeList,
  year,
}: {
  gradeList: IGradeListItem[];
  year: IAcademicYearListItem;
}) {
  return (
    <Sidebar collapsible="none" className="sticky top-0 h-screen">
      <SidebarHeader>
        <Link href={"/nav/student" as Route} className={buttonVariants({ variant: "outline", className: "w-fit" })}>
          <ArrowLeftIcon />
          Change year
        </Link>
        <TypographyH1>Year {year.name}</TypographyH1>
        <Separator />
        <TypographyH2>All Grades</TypographyH2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="flex-1">
          {gradeList.length > 0 && (
            <SidebarGroupContent>
              <SidebarMenu>
                {gradeList.map((grade) => (
                  <SidebarMenuItem key={grade.id}>
                    <SidebarMenuButton
                      isActive={false}
                      render={<Link href={`/grades/${grade.id}?yearId=${year.id}`} />}
                    >
                      <GraduationCapIcon aria-hidden="true" />
                      <span>{grade.name}</span>
                      {true && (
                        <Badge variant="outline" className="ml-auto h-5 px-1.5 text-[11px]">
                          8
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}

          {gradeList.length === 0 && (
            <SidebarGroupContent>
              <Empty>
                <EmptyMedia>
                  <GraduationCapIcon className="size-8" />
                </EmptyMedia>
                <EmptyTitle>No grades found</EmptyTitle>
                <EmptyContent>
                  You don&apos;t have any grades yet. Start by adding a new grade to manage your academic years.
                  <Button className={"w-full"} variant={"outline"} render={<Link href={"/nav/setup"} />}>
                    <ArrowLeftIcon className="size-4" />
                    Take me to add a new grade
                  </Button>
                </EmptyContent>
              </Empty>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Link href={"/"} className={buttonVariants({ variant: "outline" })}>
          <HomeIcon />
          Go Home
        </Link>
        <Separator />
        <p className="text-xs text-sidebar-foreground/60 text-center">A Project by CROWNIX</p>
      </SidebarFooter>
    </Sidebar>
  );
}
