"use client";

import EmptyState from "./empty-state";
import { OctagonAlertIcon } from "lucide-react";
import { Button } from "@/components/shadcn/button";

export default function ErrorState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex h-screen w-full items-center justify-center absolute backdrop-blur-xs top-0 left-0">
      <EmptyState
        noBorder
        icon={OctagonAlertIcon}
        title={title}
        description={description}
        description2="If the problem persists, contact support (+94 77 65 65 800)"
        action={
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Reload
          </Button>
        }
      />
    </div>
  );
}
