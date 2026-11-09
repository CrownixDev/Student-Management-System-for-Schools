"use client";
import { Button } from "@/components/shadcn/button";
import { useQueryState } from "nuqs";

export default function SidebarResultViewButton() {
  const [, setType] = useQueryState("type", { shallow: false });
  return (
    <Button variant="secondary" onClick={() => setType("view")}>
      View Results
    </Button>
  );
}
