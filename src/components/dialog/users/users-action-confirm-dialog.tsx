"use client";

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
import { Label } from "@/components/shadcn/label";
import { useState } from "react";
import RenderDialogErrors from "@/components/ui/dialog/render-dialog-errors";

export default function UsersActionConfirmDialog({
  open,
  onOpenChange,
  initialErrors,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialErrors?: string[];
  onConfirm: (password: string) => void;
}) {
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>(initialErrors ?? []);

  function handleConfirm() {
    if (!password) {
      setErrors(["Please enter your password"]);
      return;
    }

    onConfirm(password);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm its you</DialogTitle>
          <DialogDescription>Enter your password to authorize these changes.</DialogDescription>
        </DialogHeader>
        <RenderDialogErrors errors={errors} />
        <div className="space-y-2">
          <Label htmlFor="password">Your password</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm and save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
