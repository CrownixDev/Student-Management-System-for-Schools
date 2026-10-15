"use client";
import { Button } from "@/components/shadcn/button";
import { useQueryState } from "nuqs";

export default function SidebarResultViewButton() {
  const [_, setType] = useQueryState("type", { shallow: false });
  return (
    <Button variant="outline" onClick={() => setType("view")}>
      View Results
    </Button>
  );
}
