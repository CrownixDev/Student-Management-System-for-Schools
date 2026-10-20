"use client";

import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Separator } from "@/components/shadcn/separator";
import { ITeacher } from "@/features/teachers";
import { useState } from "react";
import RenderDialogErrors from "./compoennts/render-dialog-errors";

interface TeacherFormData {
  fullName: string;
  phone: string;
  isActive: boolean;
  hasUserAccount: boolean;
  username: string;
  role: "admin" | "class_teacher" | "subject_teacher";
}

const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "Class Teacher", value: "class_teacher" },
  { label: "Subject Teacher", value: "subject_teacher" },
];

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
    hasUserAccount: false,
    username: "",
    role: "subject_teacher",
  });
  const [errors, setErrors] = useState<string[]>([]);

  function handleSave() {
    const newErrors: string[] = [];

    if (!formData.fullName.trim()) {
      newErrors.push("Teacher full name is required.");
    }

    if (formData.hasUserAccount && !formData.username.trim()) {
      newErrors.push("Username is required when user account is enabled.");
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

        <Separator className="my-1" />

        <Field orientation="horizontal">
          <Checkbox
            id="teacher-user-account"
            checked={formData.hasUserAccount}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, hasUserAccount: checked === true }))
            }
          />
          <FieldLabel htmlFor="teacher-user-account">Create / Link User Login Account</FieldLabel>
        </Field>

        {formData.hasUserAccount && (
          <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-3">
            <Field>
              <FieldLabel htmlFor="user-username">Username</FieldLabel>
              <Input
                id="user-username"
                placeholder="Enter login username"
                value={formData.username}
                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
              />
            </Field>
            <Field>
              <FieldLabel>System Role</FieldLabel>
              <Select
                value={formData.role}
                onValueChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    role: val as TeacherFormData["role"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {roleOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>
        )}

        <RenderDialogErrors errors={errors} />
      </FieldGroup>
      <DialogFooter className="mt-5">
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
