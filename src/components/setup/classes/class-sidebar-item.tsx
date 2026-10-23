import { Badge } from "@/components/shadcn/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/shadcn/collapsible";
import { IGradeWithClassesItem } from "@/features/grades";
import { ChevronRightIcon } from "lucide-react";
import ClassAssignBatchBtn from "./buttons/class-assign-batch-btn";
import ClassSidebarBtn from "./buttons/class-sidebar-btn";
import ClassNewBtn from "./buttons/class-new-btn";

export default function ClassSidebarItem({ open = false, grade }: { open?: boolean; grade: IGradeWithClassesItem }) {
  const currentBatch = grade.classes.find((cls) => cls.batch)?.batch;

  return (
    <Collapsible defaultOpen={open} className="border-b">
      <div className="flex items-center gap-1 px-2 py-2">
        <CollapsibleTrigger className="group flex min-w-0 flex-1 items-center gap-2 rounded-md px-1.5 py-1 text-left text-sm font-medium hover:bg-muted">
          <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground group-data-panel-open:rotate-90" />
          <div className="flex gap-1 truncate">
            <span className="truncate">{grade.name}</span>
            <Badge variant="outline">{currentBatch?.name}</Badge>
          </div>
          <Badge variant="outline" className="ml-auto shrink-0">
            {grade.classes.length}
          </Badge>
        </CollapsibleTrigger>
        <ClassAssignBatchBtn grade={grade} />
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
