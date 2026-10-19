"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/shadcn/alert-dialog";
import { Button } from "@/components/shadcn/button";
import { IAcademicYear } from "@/features/academic-years";
import { DialogRootActions } from "@base-ui/react";
import { StarIcon } from "lucide-react";
import { useRef } from "react";

export default function SetAsCurrentYearDialog({ year }: { year: IAcademicYear }) {
  const ref = useRef<DialogRootActions | null>(null);

  function handleOnSet() {
    console.log("Doing the thing...");
    ref.current?.close();
  }

  return (
    <AlertDialog actionsRef={ref}>
      <AlertDialogTrigger
        render={
          <Button size="sm" variant="outline" title="Set this year as the current active academic session">
            <StarIcon />
            Set Current
          </Button>
        }
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Set {year.name} as Current Academic Year</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to set this academic year as the current active year? This year will be used to create or manage
            classes, subjects, and other related things.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleOnSet}>Yes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
