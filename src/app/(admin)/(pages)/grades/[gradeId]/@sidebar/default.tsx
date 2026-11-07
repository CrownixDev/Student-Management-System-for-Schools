import { Badge } from "@/components/shadcn/badge";
import { buttonVariants } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
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
import { academicYearsService, IAcademicYear } from "@/features/academic-years";
import { ArrowLeftIcon, HomeIcon, HousesIcon } from "lucide-react";
import { gradesService, IGradeListItem } from "@/features/grades";
import { batchService, IBatchListItem } from "@/features/batch";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { classService } from "@/features/class";
import { redirect } from "next/navigation";
import { idCache } from "@/lib/nuqs/id";
import EmptyState from "@/components/ui/empty-state";
import Link from "next/link";

export default async function SidebarContentPage({ params, searchParams }: PageProps<"/grades/[gradeId]">) {
  const { yearId, batchId } = await idCache.parse(searchParams);
  const { gradeId } = await params;

  let yearData: IAcademicYear | null = null;
  let gradeData: IGradeListItem | null = null;
  let batchData: IBatchListItem | null = null;

  try {
    if (yearId) yearData = await academicYearsService.getListItemById(yearId);
    if (gradeId) gradeData = await gradesService.getListItemById(gradeId);
    if (batchId) batchData = await batchService.getListItemById(batchId);
  } catch {
    redirect("/");
  }

  const isValidBatchId = batchId && batchId !== "null";

  if (!yearId || !gradeId || !yearData || !gradeData || (isValidBatchId && !batchData)) {
    redirect("/");
  }

  const classList = await classService.getList(gradeId);
  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          href={`/grades?${batchData ? "batchId=" + batchId : "yearId=" + yearId}`}
          className={buttonVariants({ variant: "outline", className: "w-fit" })}
        >
          <ArrowLeftIcon />
          Back to {batchData ? "batch" : "grades"}
        </Link>
        <div className="flex w-full items-center gap-2">
          <TypographyH2>{gradeData.name}</TypographyH2>
          <TypographyP>({yearData.name})</TypographyP>
        </div>
        <Separator />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="flex-1">
          <TypographyP>All Classes</TypographyP>
          <SidebarGroupContent>
            <SidebarMenu>
              {classList.map((classItem) => (
                <SidebarMenuItem key={classItem.id}>
                  <SidebarMenuButton
                    render={
                      <Link
                        href={`/grades/${gradeId}/classes/${classItem.id}?yearId=${yearId}${batchData ? "&batchId=" + batchId : ""}`}
                      />
                    }
                  >
                    <span className="truncate">{classItem.name}</span>
                    <Badge variant="outline" className="ml-auto h-5 px-1.5 text-[11px]">
                      {classItem.studentCount}
                    </Badge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {classList.length === 0 && (
                <EmptyState
                  icon={HousesIcon}
                  title="No classes found"
                  description="Start by adding classes to this grade"
                  noBorder
                />
              )}
            </SidebarMenu>
          </SidebarGroupContent>
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
