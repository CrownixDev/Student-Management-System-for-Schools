import { Badge } from "@/components/shadcn/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/shadcn/collapsible";
import { IGradeWithClassesItem } from "@/features/grades";
import { ChevronRightIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/shadcn/tooltip";
import ClassSidebarBtn from "./buttons/class-sidebar-btn";
import ClassGradeEditBtn from "./buttons/class-grade-edit-btn";
import ClassAssignBatchBtn from "./buttons/class-assign-batch-btn";
import ClassNewBtn from "./buttons/class-new-btn";

export default function ClassSidebarItem({ open = false, grade }: { open?: boolean; grade: IGradeWithClassesItem }) {
  const currentBatch = grade.batch;

  return (
    <Collapsible defaultOpen={open} className="border-b">
      <div className="flex items-center gap-1 px-2 py-2">
        <CollapsibleTrigger className="group flex min-w-0 flex-1 items-center gap-2 rounded-md px-1.5 py-1 text-left text-sm font-medium hover:bg-muted">
          <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground group-data-panel-open:rotate-90" />
          <div className="flex gap-1 truncate">
            <span className="truncate" title={grade.name}>
              {grade.name}
            </span>
            <Badge variant="outline">{currentBatch?.name}</Badge>
          </div>
        </CollapsibleTrigger>
        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger delay={300}>
              <Badge variant="outline" className="ml-auto shrink-0">
                {grade.classes.length}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>Classes count</TooltipContent>
          </Tooltip>
          <ClassAssignBatchBtn grade={grade} />
          <ClassGradeEditBtn grade={grade} />
        </div>
      </div>
      <CollapsibleContent>
        <div className="space-y-0.5 px-2 pb-2">
          {grade.classes.map((item) => (
            <ClassSidebarBtn key={item.id} classItem={item} />
          ))}
          <ClassNewBtn grade={grade} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
