import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { SubjectCategory } from "@/generated/prisma/client";
import { useState } from "react";

import { Checkbox } from "@/components/shadcn/checkbox";
import { Button } from "@/components/shadcn/button";
import { SubjectCreateInput } from "@/generated/prisma/models";
import RenderDialogErrors from "./compoennts/render-dialog-errors";
import { Alert, AlertDescription, AlertTitle } from "../shadcn/alert";
import { CircleQuestionMarkIcon } from "lucide-react";
import { ISubject } from "@/features/subjects";
import { IStreamListItem } from "@/features/streams/steam.types";

export const subjectCategories = [
  { label: "Core", value: "core" },
  { label: "Religion", value: "religion" },
  { label: "O/L Basket", value: "ol_basket" },
  { label: "A/L Main", value: "al_main" },
  { label: "A/L Common", value: "al_common" },
  { label: "Other", value: "other" },
] satisfies { value: SubjectCategory; label: string }[];

export default function SubjectDialog({
  open,
  onOpenChange,
  data,
  streams = [],
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: Pick<ISubject, "name" | "code" | "category" | "streams">;
  streams?: IStreamListItem[];
}) {
  const [subject, setSubject] = useState<Pick<SubjectCreateInput, "name" | "category" | "code">>(
    data ?? { name: "", category: "core", code: "" },
  );

  const [streamIds, setStreamIds] = useState<string[]>(streams.map((stream) => stream.id) ?? []);
  const [errors, setErrors] = useState<string[]>([]);

  function toggleStream(id: string, checked: boolean) {
    setStreamIds((current) => (checked ? [...new Set([...current, id])] : current.filter((value) => value !== id)));
  }

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

          {!data && subject.category === "core" && (
            <Alert className="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
              <CircleQuestionMarkIcon />
              <AlertTitle>Core</AlertTitle>
              <AlertDescription>
                Core subjects are mandatory for all non A/L students. E.g: Sinhala, Science
              </AlertDescription>
            </Alert>
          )}

          {subject.category === "al_main" && streams?.length > 0 && (
            <Field>
              <FieldLabel>A/L streams</FieldLabel>
              <div className="flex flex-wrap gap-4">
                {streams.map((stream) => (
                  <label key={stream.id} className="inline-flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={streamIds.includes(stream.id)}
                      onCheckedChange={(checked) => toggleStream(stream.id, checked === true)}
                    />
                    {stream.name}
                  </label>
                ))}
              </div>
            </Field>
          )}

          <RenderDialogErrors errors={errors} />
        </FieldGroup>
        <DialogFooter className="mt-5">
          <Button type="submit" onClick={handleSave}>
            {data ? "Save changes" : "Add subject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
