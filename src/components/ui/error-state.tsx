"use client";

import EmptyState from "./empty-state";
import { OctagonAlertIcon } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { cn } from "cn";

type Normal = {
  type: "normal";
  noBorder?: boolean;
};

type Absolute = {
  type: "absolute";
  noBg?: boolean;
  noBorder?: boolean;
};

type Props = {
  title: string;
  description: string;
} & (Normal | Absolute);

function StateComp({ title, description, noBorder }: { title: string; description: string; noBorder: boolean }) {
  return (
    <EmptyState
      noBorder={noBorder}
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
  );
}

export default function ErrorState(props: Props) {
  if (props.type === "normal") {
    const { title, description, noBorder = false } = props;
    return <StateComp title={title} description={description} noBorder={noBorder} />;
  }

  if (props.type === "absolute") {
    const { title, description, noBorder = false, noBg } = props;
    return (
      <div className="flex h-screen w-full items-center justify-center absolute backdrop-blur-xs top-0 left-0">
        <div className={cn(!noBg && "bg-black border")}>
          <StateComp title={title} description={description} noBorder={noBorder} />
        </div>
      </div>
    );
  }
  return null;
}
