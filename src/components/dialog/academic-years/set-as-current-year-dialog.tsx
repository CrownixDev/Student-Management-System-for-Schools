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
import { setCurrentAcademicYearAction } from "@/features/academic-years/year.actions";
import { DialogRootActions } from "@base-ui/react";
import { Loader2, StarIcon } from "lucide-react";
import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { ACTIVE_YEAR } from "@/lib/query-keys";
import { useRouter } from "next/navigation";

function FormButtons() {
  const { pending } = useFormStatus();

  return (
    <>
      <AlertDialogCancel type="button" disabled={pending}>
        Cancel
      </AlertDialogCancel>
      <AlertDialogAction type="submit" disabled={pending}>
        {pending && <Loader2 className="animate-spin" />}
        Yes
      </AlertDialogAction>
    </>
  );
}

export default function SetAsCurrentYearDialog({ year }: { year: IAcademicYear }) {
  const ref = useRef<DialogRootActions | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  async function handleOnSet(e: React.SubmitEvent) {
    e.preventDefault();
    if (!year?.id) return;
    const res = await setCurrentAcademicYearAction(year.id);
    if (res.success) {
      await queryClient.invalidateQueries({ queryKey: [ACTIVE_YEAR] });
      router.refresh();
      ref.current?.close();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
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
        <form onSubmit={handleOnSet}>
          <AlertDialogHeader>
            <AlertDialogTitle>Set {year.name} as Current Academic Year</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to set this academic year as the current active year? This year will be used to create or
              manage classes, subjects, and other related things.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <FormButtons />
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
