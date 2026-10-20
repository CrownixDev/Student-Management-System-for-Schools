"use client";

import MediumDialog from "@/components/dialog/medium/medium-dialog";
import TooltipButton from "@/components/ui/tooltip-button";
import { IMediumListItem } from "@/features/medium";
import { PencilIcon } from "lucide-react";
import { useState } from "react";

export default function MediumEditBtn({ medium }: { medium: IMediumListItem }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TooltipButton tooltip="Edit medium" size="icon-sm" variant="ghost" onClick={() => setOpen(true)}>
        <PencilIcon />
      </TooltipButton>
      {open && <MediumDialog open={open} onOpenChange={setOpen} data={medium} />}
    </>
  );
}
