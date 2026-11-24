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
import { Loader2, StarIcon } from "lucide-react";
import { useRef } from "react";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { rpcTanStack } from "@/lib/orpc/client";
import { revalidateCache } from "@/lib/actions";
import { isDefinedError } from "@orpc/client";

export default function SetAsCurrentYearDialog({ year }: { year: IAcademicYear }) {
  const ref = useRef<DialogRootActions | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending, isSuccess } = useMutation(
    rpcTanStack.academicYear.setAsCurrent.mutationOptions({
      onSuccess: async () => {
        await revalidateCache("/setup");
        await queryClient.invalidateQueries({ queryKey: rpcTanStack.academicYear.key() });
        router.refresh();
      },
      onError: (error) => {
        if (isDefinedError(error)) {
          toast.error(error.message);
        } else {
          toast.error("Unknown error occured");
        }
      },
    }),
  );

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (!year?.id) return;
    mutate({ id: year.id });
    if (isSuccess) {
      ref.current?.close();
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
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>Set {year.name} as Current Academic Year</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to set this academic year as the current active year? This year will be used to create or
              manage classes, subjects, and other related things.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button" disabled={isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction type="submit" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
