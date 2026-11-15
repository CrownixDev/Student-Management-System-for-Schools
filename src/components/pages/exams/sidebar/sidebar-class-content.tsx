import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/shadcn/sidebar";
import { ArrowLeftIcon, GraduationCapIcon } from "lucide-react";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { Button, buttonVariants } from "@/components/shadcn/button";
import { IGradeListItem } from "@/features/grades";
import { IAcademicYear } from "@/features/academic-years";
import { IClassList } from "@/features/class";
import { Separator } from "@/components/shadcn/separator";
import SidebarResultViewButton from "./sidebar-result-view-button";
import SidebarClassButton from "./sidebar-class-button";
import EmptyState from "@/components/ui/empty-state";
import Link from "next/link";

export default function SidebarClassContent({
  year,
  gradeItem,
  classList,
}: {
  year: IAcademicYear;
  gradeItem: IGradeListItem;
  classList: IClassList;
}) {
  return (
    <>
      <SidebarHeader>
        <Link
          href={`/exams?yearId=${year.id}`}
          className={buttonVariants({ variant: "link", className: "w-fit hover:no-underline!" })}
        >
          <ArrowLeftIcon />
          Change grade
        </Link>
        <div className="flex gap-3 items-center">
          <TypographyH2>{gradeItem.name}</TypographyH2>
          <TypographyP>({year.name})</TypographyP>
        </div>
        <Separator />
        <SidebarResultViewButton />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="flex-1">
          <TypographyP>All Classes</TypographyP>
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
                  <Link href={"/setup/classes"}>
                    <Button className={"w-full"} variant={"outline"}>
                      <ArrowLeftIcon className="size-4" />
                      Take me to add a new class
                    </Button>
                  </Link>
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
