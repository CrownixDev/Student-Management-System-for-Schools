import EmptyState from "@/components/ui/empty-state";
import { MousePointerClickIcon } from "lucide-react";

export default function page() {
  return (
    <EmptyState
      icon={MousePointerClickIcon}
      title="Select an item"
      description="Choose an item from left sidebar to view its details."
    />
  );
}
