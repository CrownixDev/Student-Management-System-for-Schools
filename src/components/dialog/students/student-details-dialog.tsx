"use client";

import { useState } from "react";
import { Button } from "@/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Textarea } from "@/components/shadcn/textarea";
import { IStudentProfile } from "@/features/students";
import { genderSelectOptions, studentStatusSelectOptions } from "@/lib/select-options";
import { getHtmlDateString } from "@/lib/utils";
import { PencilIcon, Trash2Icon, XIcon } from "lucide-react";
import DeleteConfirmationDialog from "@/components/dialog/delete-confirmation-dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: IStudentProfile) => void | Promise<void>;
  data?: IStudentProfile;
  onDelete?: (studentId: string) => void | Promise<void>;
}

function ReadOnlyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 space-y-1 rounded-md border bg-muted/20 px-3 py-2.5">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="wrap-break-word text-sm font-medium">{value}</dd>
    </div>
  );
}

export default function StudentDetailsDialog({ open, onOpenChange, data, onSave, onDelete }: Props) {
  const INITIAL_DATA = {
    id: data?.id ?? "",
    admissionNo: data?.admissionNo ?? "",
    fullName: data?.fullName ?? "",
    dob: data?.dob ?? new Date(),
    gender: data?.gender ?? "male",
    nic: data?.nic ?? "",
    phone: data?.phone ?? "",
    address: data?.address ?? "",
    guardianName: data?.guardianName ?? "",
    guardianPhone: data?.guardianPhone ?? "",
    status: data?.status ?? "active",
  };
  const [formData, setFormData] = useState<IStudentProfile>(INITIAL_DATA);

  const [isEditing, setIsEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function handleEdit() {
    setFormData(INITIAL_DATA);
    setIsEditing(true);
  }

  function handleDiscard() {
    if (confirm("Are you sure you want to discard changes?")) {
      setFormData(INITIAL_DATA);
      setIsEditing(false);
    }
  }

  const isCreatingStudent = !data;

  async function handleSave() {
    await onSave(formData);
    setIsEditing(false);
    if (isCreatingStudent) {
      onOpenChange(false);
    }
  }

  const isViewingStudent = data && !isEditing;
  const isEditingStudent = data && isEditing;
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] min-w-xl grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit student" : data ? data.fullName : "Student"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update the student and guardian details." : "Student and guardian information."}
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 overflow-y-auto py-1 pr-2 scrollbar-thin">
            {isViewingStudent && (
              <div className="space-y-6">
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold">Student details</h3>
                  <dl className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <ReadOnlyValue label="Full name" value={data.fullName} />
                    </div>
                    <ReadOnlyValue label="Admission number" value={data.admissionNo} />
                    <ReadOnlyValue
                      label="Date of birth"
                      value={data.dob ? getHtmlDateString(data.dob) : "Not provided"}
                    />
                    <ReadOnlyValue label="Phone" value={data.phone || "Not provided"} />
                    <ReadOnlyValue label="NIC" value={data.nic || "Not provided"} />
                    <ReadOnlyValue
                      label="Gender"
                      value={
                        genderSelectOptions.find((option) => option.value === data.gender)?.label ?? "Not provided"
                      }
                    />
                    <ReadOnlyValue
                      label="Status"
                      value={
                        studentStatusSelectOptions.find((option) => option.value === data.status)?.label ?? data.status
                      }
                    />
                    <div className="col-span-2">
                      <ReadOnlyValue label="Address" value={data.address || "Not provided"} />
                    </div>
                  </dl>
                </section>
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold">Guardian information</h3>
                  <dl className="grid grid-cols-2 gap-3">
                    <ReadOnlyValue label="Name" value={data.guardianName || "Not provided"} />
                    <ReadOnlyValue label="Phone" value={data.guardianPhone || "Not provided"} />
                  </dl>
                </section>
              </div>
            )}

            {(isCreatingStudent || isEditingStudent) && (
              <FieldGroup>
                <FieldSet>
                  <FieldLegend>Student Details</FieldLegend>
                  <FieldGroup className="grid grid-cols-2 gap-4">
                    <Field className="col-span-2">
                      <FieldLabel htmlFor="student-full-name">Full name</FieldLabel>
                      <Textarea
                        id="student-full-name"
                        placeholder="Enter full name"
                        value={formData.fullName}
                        onChange={(event) => setFormData((previous) => ({ ...previous, fullName: event.target.value }))}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="student-admission-no">Admission number</FieldLabel>
                      <Input
                        id="student-admission-no"
                        placeholder="Enter admission number"
                        value={formData.admissionNo}
                        onChange={(event) =>
                          setFormData((previous) => ({ ...previous, admissionNo: event.target.value }))
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="student-dob">Date of birth</FieldLabel>
                      <Input
                        id="student-dob"
                        type="date"
                        value={formData.dob ? getHtmlDateString(formData.dob) : undefined}
                        onChange={(event) =>
                          setFormData((previous) => ({ ...previous, dob: new Date(event.target.value) }))
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="student-nic">NIC</FieldLabel>
                      <Input
                        id="student-nic"
                        placeholder="Enter student NIC"
                        value={formData.nic ?? ""}
                        onChange={(event) => setFormData((previous) => ({ ...previous, nic: event.target.value }))}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="student-phone">Phone</FieldLabel>
                      <Input
                        id="student-phone"
                        placeholder="Enter student phone"
                        type="tel"
                        value={formData.phone ?? ""}
                        onChange={(event) => setFormData((previous) => ({ ...previous, phone: event.target.value }))}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="student-gender">Gender</FieldLabel>
                      <Select
                        items={genderSelectOptions}
                        value={formData.gender}
                        onValueChange={(value) => {
                          if (value === null || value === "male" || value === "female") {
                            setFormData((previous) => ({ ...previous, gender: value }));
                          }
                        }}
                      >
                        <SelectTrigger id="student-gender" className="w-full">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          {genderSelectOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="student-status">Student status</FieldLabel>
                      <Select
                        items={studentStatusSelectOptions}
                        value={formData.status}
                        onValueChange={(value) => {
                          if (value !== null) {
                            setFormData((previous) => ({ ...previous, status: value }));
                          }
                        }}
                      >
                        <SelectTrigger id="student-status" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {studentStatusSelectOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field className="col-span-2">
                      <FieldLabel htmlFor="student-address">Address</FieldLabel>
                      <Textarea
                        id="student-address"
                        placeholder="Enter student address"
                        value={formData.address ?? ""}
                        onChange={(event) => setFormData((previous) => ({ ...previous, address: event.target.value }))}
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
                <FieldSet>
                  <FieldLegend>Guardian Information</FieldLegend>
                  <FieldGroup className="grid grid-cols-2 gap-4">
                    <Field className="col-span-2">
                      <FieldLabel htmlFor="student-guardian-name">Name</FieldLabel>
                      <Textarea
                        id="student-guardian-name"
                        placeholder="Enter guardian name"
                        value={formData.guardianName ?? ""}
                        onChange={(event) =>
                          setFormData((previous) => ({ ...previous, guardianName: event.target.value }))
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="student-guardian-phone">Phone</FieldLabel>
                      <Input
                        id="student-guardian-phone"
                        type="tel"
                        placeholder="Enter guardian phone"
                        value={formData.guardianPhone ?? ""}
                        onChange={(event) =>
                          setFormData((previous) => ({ ...previous, guardianPhone: event.target.value }))
                        }
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </FieldGroup>
            )}
          </div>
          <DialogFooter>
            <div className="flex w-full items-center justify-between gap-3">
              {isCreatingStudent && (
                <>
                  <div className="flex w-full items-center gap-2 justify-end">
                    <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                      Close
                    </Button>
                    <Button type="button" onClick={handleSave}>
                      Save
                    </Button>
                  </div>
                </>
              )}
              {isEditingStudent && (
                <>
                  <Button variant="outline" type="button" onClick={handleDiscard}>
                    <XIcon />
                    Discard changes
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button type="button" onClick={handleSave}>
                      Save changes
                    </Button>
                  </div>
                </>
              )}
              {isViewingStudent && (
                <>
                  <Button variant="destructive" type="button" onClick={() => setDeleteOpen(true)}>
                    <Trash2Icon />
                    Delete student
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                      Close
                    </Button>
                    <Button type="button" onClick={handleEdit}>
                      <PencilIcon />
                      Edit student
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {data && onDelete && (
        <DeleteConfirmationDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete student"
          description="Are you sure you want to delete this student?"
          itemIdentifier={`${data.fullName} (${data.admissionNo})`}
          confirmationPhrase="Yes i wanted to delete"
          onConfirm={() => onDelete(data.id)}
        />
      )}
    </>
  );
}
