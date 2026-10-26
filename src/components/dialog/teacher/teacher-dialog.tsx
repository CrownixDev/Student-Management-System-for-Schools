"use client";

import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { ITeacher } from "@/features/teachers";
import { useState } from "react";
import RenderDialogErrors from "@/components/ui/dialog/render-dialog-errors";

interface TeacherFormData {
  fullName: string;
  phone: string;
  isActive: boolean;
}

function TeacherDialogForm({
  data,
  onClose,
}: {
  data?: Pick<ITeacher, "fullName" | "phone" | "isActive">;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<TeacherFormData>({
    fullName: data?.fullName ?? "",
    phone: data?.phone ?? "",
    isActive: data?.isActive ?? true,
  });
  const [errors, setErrors] = useState<string[]>([]);

  function handleSave() {
    const newErrors: string[] = [];

    if (!formData.fullName.trim()) {
      newErrors.push("Teacher full name is required.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);
    onClose();
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{data ? "Edit teacher" : "Add teacher"}</DialogTitle>
      </DialogHeader>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="teacher-name">Full name</FieldLabel>
          <Input
            id="teacher-name"
            value={formData.fullName}
            placeholder="Enter teacher's name"
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, fullName: e.target.value }));
              if (errors.length) setErrors([]);
            }}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="teacher-phone">Phone</FieldLabel>
          <Input
            id="teacher-phone"
            type="tel"
            placeholder="Enter teacher's phone number"
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
          />
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="teacher-active"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked === true }))}
          />
          <FieldLabel htmlFor="teacher-active">Active teacher</FieldLabel>
        </Field>
        <RenderDialogErrors errors={errors} />
      </FieldGroup>
      <DialogFooter>
        <Button onClick={handleSave}>{data ? "Save changes" : "Add teacher"}</Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default function TeacherDialog({
  open,
  onOpenChange,
  data,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: Pick<ITeacher, "fullName" | "phone" | "isActive">;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && <TeacherDialogForm data={data} onClose={() => onOpenChange(false)} />}
    </Dialog>
  );
}
