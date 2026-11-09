import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/shadcn/sidebar";
import { TypographyH1, TypographyP } from "@/components/ui/typography";
import { GraduationCapIcon } from "lucide-react";
import { IGradeListItemForYear } from "@/features/grades";
import EmptyState from "@/components/ui/empty-state";
import SidebarGradeButton from "./sidebar-grade-button";
import YearBatchSelectorDialog from "@/components/dialog/sidebar/year-batch-selector-dialog";

export default function SidebarGradeContent({ grades }: { grades: IGradeListItemForYear[] }) {
  return (
    <>
      <SidebarHeader>
        <TypographyH1>Exams</TypographyH1>
        <YearBatchSelectorDialog allow={{ batch: false }} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="flex-1">
          <TypographyP>All Grades</TypographyP>
          {grades.length > 0 && (
            <SidebarGroupContent>
              <SidebarMenu>
                {grades.map((grade) => (
                  <SidebarGradeButton key={grade.id} gradeItem={grade} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}

          {grades.length === 0 && (
            <SidebarGroupContent>
              <EmptyState
                icon={GraduationCapIcon}
                title="No grades found"
                description="You don't have any grades yet. Start by adding a new grade."
                noBorder
              />
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}
