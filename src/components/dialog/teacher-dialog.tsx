import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { TeacherCreateInput } from "@/generated/prisma/models";
import { useState } from "react";
import RenderDialogErrors from "./compoennts/render-dialog-errors";
import { ITeacher } from "@/features/teachers";

export default function TeacherDialog({
  open,
  onOpenChange,
  data,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: Pick<ITeacher, "fullName" | "phone" | "isActive">;
}) {
  const [teacher, setTeacher] = useState<TeacherCreateInput>(data ?? { fullName: "", isActive: true });
  const [errors, setErrors] = useState<string[]>([]);

  function handleSave() {
    setErrors(["Happy Birthday To you", "No body likes you", "You look like an animal", "Go back to the zoo"]);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{data ? "Edit teacher" : "Add teacher"}</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="teacher-name">Full name</FieldLabel>
            <Input
              id="teacher-name"
              value={teacher.fullName}
              placeholder="Enter teacher's name"
              onChange={(e) => setTeacher((prevData) => ({ ...prevData, fullName: e.target.value }))}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="teacher-phone">Phone</FieldLabel>
            <Input
              id="teacher-phone"
              type="tel"
              placeholder="Enter teacher's phone number"
              value={teacher.phone ?? ""}
              onChange={(e) => setTeacher((prevData) => ({ ...prevData, phone: e.target.value }))}
            />
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="teacher-active"
              checked={teacher.isActive}
              onCheckedChange={(checked) => setTeacher((prevData) => ({ ...prevData, isActive: checked === true }))}
            />
            <FieldLabel htmlFor="teacher-active">Active teacher</FieldLabel>
          </Field>
          <RenderDialogErrors errors={errors} />
        </FieldGroup>
        <DialogFooter className="mt-5">
          <Button onClick={handleSave}>{data ? "Save changes" : "Add teacher"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
