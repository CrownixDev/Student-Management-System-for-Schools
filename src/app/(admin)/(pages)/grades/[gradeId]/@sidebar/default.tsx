import { Badge } from "@/components/shadcn/badge";
import { buttonVariants } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcn/sidebar";
import { IAcademicYear } from "@/features/academic-years";
import { ArrowLeftIcon, HousesIcon } from "lucide-react";
import { IGradeListItem } from "@/features/grades";
import { IBatchListItem } from "@/features/batch";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { redirect } from "next/navigation";
import { idCache } from "@/lib/nuqs/id";
import { getServerCaller } from "@/lib/orpc/server-caller";
import AppSidebarFooter from "@/components/ui/sidebar/sidebar-footer";
import EmptyState from "@/components/ui/empty-state";
import Link from "next/link";

export default async function SidebarContentPage({ params, searchParams }: PageProps<"/grades/[gradeId]">) {
  const { yearId, batchId } = await idCache.parse(searchParams);
  const { gradeId } = await params;
  const caller = await getServerCaller();

  let yearData: IAcademicYear | null = null;
  let gradeData: IGradeListItem | null = null;
  let batchData: IBatchListItem | null = null;

  try {
    if (yearId) yearData = await caller.academicYear.getListItemById({ id: yearId });
    if (gradeId) gradeData = await caller.grade.getListItemById({ gradeId });
    if (batchId) batchData = await caller.batch.getListItemById({ id: batchId });
  } catch {
    redirect("/");
  }

  const isValidBatchId = batchId && batchId !== "null";

  if (!yearId || !gradeId || !yearData || !gradeData || (isValidBatchId && !batchData)) {
    redirect("/");
  }

  const classList = await caller.class.getList({ gradeId });
  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          href={`/grades?${batchData ? "batchId=" + batchId : "yearId=" + yearId}`}
          className={buttonVariants({ variant: "link", className: "w-fit hover:no-underline!" })}
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
      <AppSidebarFooter />
    </Sidebar>
  );
}
