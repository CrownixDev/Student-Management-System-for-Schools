import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { SubjectCategory } from "@/generated/prisma/client";
import { SubjectCreateInput } from "@/generated/prisma/models";
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";
import { CircleQuestionMarkIcon, TrashIcon } from "lucide-react";
import { subjectCategories } from "@/features/subjects/subject.enums";
import { Field, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { ISubject } from "@/features/subjects";
import { useState } from "react";
import RenderDialogErrors from "@/components/ui/dialog/render-dialog-errors";
import TooltipButton from "@/components/ui/tooltip-button";

export default function SubjectDialog({
  open,
  onOpenChange,
  data,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: Partial<Pick<ISubject, "name" | "code" | "category">>;
}) {
  const [subject, setSubject] = useState<Pick<SubjectCreateInput, "name" | "category" | "code">>({
    name: data?.name ?? "",
    category: data?.category ?? "core",
    code: data?.code ?? "",
  });

  const [errors, setErrors] = useState<string[]>([]);

  function handleSave() {
    setErrors(["Diga wadi"]);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{data ? "Edit subject" : "Add subject"}</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Subject name</FieldLabel>
            <Input
              id="name"
              placeholder="Enter subject name"
              value={subject.name}
              onChange={(e) => setSubject((prevData) => ({ ...prevData, name: e.target.value }))}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="code">Subject code</FieldLabel>
              <Input
                id="code"
                placeholder="E.g., ICT-AL"
                value={subject.code ?? ""}
                onChange={(e) => setSubject((prevData) => ({ ...prevData, code: e.target.value }))}
              />
            </Field>
            <Field>
              <FieldLabel>Category</FieldLabel>
              <Select
                items={subjectCategories}
                value={subject.category}
                onValueChange={(value) =>
                  setSubject((prevData) => ({ ...prevData, category: value as SubjectCategory }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {subjectCategories.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>

          {!(data?.name || data?.code) && subject.category === "core" && (
            <Alert className="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
              <CircleQuestionMarkIcon />
              <AlertTitle>Core</AlertTitle>
              <AlertDescription>
                Core subjects are mandatory for all non A/L students. E.g: Sinhala, Science
              </AlertDescription>
            </Alert>
          )}

          <RenderDialogErrors errors={errors} />
        </FieldGroup>
        <DialogFooter className="mt-5">
          <div className="flex min-w-full items-center">
            {(data?.name || data?.code) && (
              <TooltipButton
                tooltip="Delete this subject"
                variant="destructive"
                size="icon"
                type="button"
                onClick={() => console.log("Deleting")}
              >
                <TrashIcon />
              </TooltipButton>
            )}
            <div className="flex flex-1 gap-3 justify-end">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleSave}>
                {data ? "Save changes" : "Add subject"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
