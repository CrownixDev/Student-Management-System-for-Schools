import EmptyState from "@/components/ui/empty-state";
import { MousePointerClickIcon } from "lucide-react";

export default function page() {
  return (
    <EmptyState
      icon={MousePointerClickIcon}
      title="Select a Class"
      description="Choose a Class from left sidebar to add/manage students"
    />
  );
}
