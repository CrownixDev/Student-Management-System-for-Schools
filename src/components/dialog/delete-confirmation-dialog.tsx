"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/shadcn/alert-dialog";
import { Button } from "@/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { LucideIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

const CONFIRMATION_PHARASE = "Yes i wanted to delete";

export interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  icon?: LucideIcon;
  onConfirm?: () => void | Promise<void>;
}

function DeleteConfirmationInner({
  onClose,
  title,
  description,
  icon: Icon = Trash2Icon,
  onConfirm,
}: {
  onClose: () => void;
  title: string;
  description: string;
  icon?: LucideIcon;
  onConfirm?: () => void | Promise<void>;
}) {
  const [typedPhrase, setTypedPhrase] = useState("");
  const [step, setStep] = useState<1 | 2>(1);

  const isPhraseMatched = typedPhrase.trim() === CONFIRMATION_PHARASE.trim();

  function handleProceedToStep2() {
    if (!isPhraseMatched) return;
    setStep(2);
  }

  function handleFinalConfirm() {
    onClose();
    if (onConfirm) {
      onConfirm();
    }
  }

  return (
    <>
      {/* Step 1: Initial Prompt requiring typed confirmation */}
      <Dialog open={step === 1} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="min-w-sm gap-3">
          <DialogHeader className="gap-2 text-left">
            <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-1 ring-destructive/20">
              <Icon className="size-5" />
            </div>
            <DialogTitle className="text-lg">{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-muted-foreground">
              Please type &ldquo;
              <span className="text-foreground select-all font-mono">{CONFIRMATION_PHARASE}</span>
              &rdquo; in the box below to proceed:
            </p>

            <Input
              value={typedPhrase}
              onChange={(e) => setTypedPhrase(e.target.value)}
              placeholder={CONFIRMATION_PHARASE}
              className="font-mono"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && isPhraseMatched) {
                  e.preventDefault();
                  handleProceedToStep2();
                }
              }}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="destructive" type="button" disabled={!isPhraseMatched} onClick={handleProceedToStep2}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Step 2: 2nd Popup asking final confirmation */}
      <AlertDialog open={step === 2} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <AlertDialogContent className="max-w-md gap-4">
          <AlertDialogHeader className="gap-2 text-left">
            <AlertDialogTitle className="text-lg font-semibold">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">
              This action cannot be undone and will permanently remove this item from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setStep(1);
                setTypedPhrase("");
              }}
            >
              Go Back
            </Button>
            <Button variant="destructive" type="button" onClick={handleFinalConfirm}>
              Yes, permanently delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function DeleteConfirmationDialog({ open, onOpenChange, ...props }: DeleteConfirmationDialogProps) {
  if (!open) return null;
  return <DeleteConfirmationInner onClose={() => onOpenChange(false)} {...props} />;
}
