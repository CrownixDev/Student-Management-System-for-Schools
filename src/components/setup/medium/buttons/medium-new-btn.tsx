"use client";

import MediumDialog from "@/components/dialog/medium/medium-dialog";
import { Button } from "@/components/shadcn/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export default function MediumNewBtn() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-1.5 shadow-xs">
        <PlusIcon className="size-4" />
        Add Medium
      </Button>
      {open && <MediumDialog open={open} onOpenChange={setOpen} />}
    </>
  );
}
