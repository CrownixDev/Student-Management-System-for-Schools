import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/shadcn/sidebar";
import { Button, buttonVariants } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
import { TypographyH1, TypographyH2, TypographyP } from "@/components/ui/typography";
import { ArrowLeftIcon, GraduationCapIcon, PlusIcon } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import Link from "next/link";
import { IAcademicYearListItem } from "@/features/academic-years";
import { IClassList } from "@/features/class";
import SidebarClassButton from "./sidebar-class-button";
import { IGradeListItem } from "@/features/grades";
import SidebarResultViewButton from "./sidebar-result-view-button";

export default function SidebarClassContent({
  year,
  gradeItem,
  classList,
}: {
  year: IAcademicYearListItem;
  gradeItem: IGradeListItem;
  classList: IClassList;
}) {
  return (
    <>
      <SidebarHeader>
        <Link href={`/exams?yearId=${year.id}`} className={buttonVariants({ variant: "outline", className: "w-fit" })}>
          <ArrowLeftIcon />
          Change grade
        </Link>
        <div className="flex gap-3 items-center">
          <TypographyH1>{gradeItem.name}</TypographyH1>
          <TypographyP>({year.name})</TypographyP>
        </div>
        <Separator />
        <TypographyH2>All Classes</TypographyH2>
        <SidebarResultViewButton />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="flex-1">
          {classList.length > 0 && (
            <SidebarGroupContent>
              <SidebarMenu>
                {classList.map((classItem) => (
                  <SidebarClassButton key={classItem.id} classItem={classItem} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}

          {classList.length === 0 && (
            <SidebarGroupContent>
              <EmptyState
                icon={GraduationCapIcon}
                title="No grades found"
                description="You don't have any grades yet. Start by adding a new grade."
                action={
                  <Button className={"w-full"} variant={"outline"}>
                    <PlusIcon className="size-4" />
                    Take me to add a new class
                  </Button>
                }
                noBorder
              />
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}
