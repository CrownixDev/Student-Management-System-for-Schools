import EmptyState from "@/components/admin/empty-state";
import { MousePointerClickIcon } from "lucide-react";

export default async function GradesPage() {
  return (
    <EmptyState
      icon={MousePointerClickIcon}
      title="Select a Grade"
      description="Choose a Grade from left sidebar to add/manage clases and students"
    />
  );
}
