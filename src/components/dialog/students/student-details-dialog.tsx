"use client";

import { useState } from "react";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Textarea } from "@/components/shadcn/textarea";
import { IStudentProfile } from "@/features/students";
import { genderSelectOptions, studentStatusSelectOptions } from "@/lib/select-options";
import { getHtmlDateString } from "@/lib/utils";
import { PencilIcon, Trash2Icon, XIcon } from "lucide-react";
import { studentSchema } from "@/features/students/student.schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStudentAction, deleteStudentAction, updateStudentAction } from "@/features/students/students.actions";
import { toast } from "react-toastify";
import DeleteConfirmationDialog from "@/components/dialog/delete-confirmation-dialog";
import z from "zod";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: IStudentProfile;
}

function ReadOnlyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 space-y-1 rounded-md border bg-muted/20 px-3 py-2.5">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="wrap-break-word text-sm font-medium">{value}</dd>
    </div>
  );
}

export default function StudentDetailsDialog({ open, onOpenChange, data }: Props) {
  const INITIAL_DATA = {
    admissionNo: data?.admissionNo ?? "",
    fullName: data?.fullName ?? "",
    dob: data?.dob ? getHtmlDateString(data.dob) : "",
    gender: data?.gender ?? "male",
    nic: data?.nic ?? "",
    phone: data?.phone ?? "",
    address: data?.address ?? "",
    guardianName: data?.guardianName ?? "",
    guardianPhone: data?.guardianPhone ?? "",
    status: data?.status ?? "active",
  };

  const form = useForm({
    defaultValues: INITIAL_DATA,
    resolver: zodResolver(studentSchema),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function handleDiscard() {
    if (confirm("Are you sure you want to discard changes?")) {
      form.setValues(INITIAL_DATA);
      setIsEditing(false);
    }
  }

  async function handleCreate(formData: z.infer<typeof studentSchema>) {
    const res = await createStudentAction(formData);
    if (res.success) {
      onOpenChange(false);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  async function handleUpdate(formData: z.infer<typeof studentSchema>) {
    if (!data?.id) return;
    const res = await updateStudentAction(data.id, formData);
    if (res.success) {
      setIsEditing(false);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  async function handleDelete() {
    if (!data?.id) return;
    const res = await deleteStudentAction(data.id);
    if (res.success) {
      onOpenChange(false);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  const isCreatingStudent = !data;
  const isViewingStudent = data && !isEditing;
  const isEditingStudent = data && isEditing;
  const isSubmitting = form.formState.isSubmitting;

  return (
    <>
      <Dialog open={open} onOpenChange={isSubmitting ? undefined : onOpenChange}>
        <DialogContent className="max-h-[90vh] min-w-xl grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Student details</DialogTitle>
          </DialogHeader>
          <div className="min-h-0 overflow-y-auto py-1 pr-2 scrollbar-thin">
            {isViewingStudent && (
              <div className="space-y-6">
                <section className="space-y-3">
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
              <form id="student-form" onSubmit={form.handleSubmit(isEditing ? handleUpdate : handleCreate)}>
                <FieldGroup>
                  <FieldSet>
                    <FieldGroup className="grid grid-cols-2 gap-4">
                      <Controller
                        name="fullName"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field className="col-span-2" data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="student-full-name">Full name</FieldLabel>
                            <Textarea
                              {...field}
                              id="student-full-name"
                              placeholder="Enter full name"
                              aria-invalid={fieldState.invalid}
                              disabled={isSubmitting}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                      <Controller
                        name="admissionNo"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="student-admission-no">Admission number</FieldLabel>
                            <Input
                              {...field}
                              id="student-admission-no"
                              placeholder="Enter admission number"
                              aria-invalid={fieldState.invalid}
                              disabled={isSubmitting}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                      <Controller
                        name="dob"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="student-dob">Date of birth</FieldLabel>
                            <Input
                              {...field}
                              id="student-dob"
                              type="date"
                              value={typeof field.value === "string" ? field.value : ""}
                              aria-invalid={fieldState.invalid}
                              disabled={isSubmitting}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                      <Controller
                        name="nic"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="student-nic">NIC</FieldLabel>
                            <Input
                              {...field}
                              id="student-nic"
                              placeholder="Enter student NIC"
                              aria-invalid={fieldState.invalid}
                              disabled={isSubmitting}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                      <Controller
                        name="phone"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="student-phone">Phone</FieldLabel>
                            <Input
                              {...field}
                              id="student-phone"
                              placeholder="Enter student phone"
                              type="tel"
                              aria-invalid={fieldState.invalid}
                              disabled={isSubmitting}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                      <Controller
                        name="gender"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="student-gender">Gender</FieldLabel>
                            <Select
                              items={genderSelectOptions}
                              value={field.value}
                              onValueChange={(value) => field.onChange(value)}
                              aria-invalid={fieldState.invalid}
                              disabled={isSubmitting}
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
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                      <Controller
                        name="status"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="student-status">Student status</FieldLabel>
                            <Select
                              items={studentStatusSelectOptions}
                              value={field.value}
                              onValueChange={(value) => field.onChange(value)}
                              aria-invalid={fieldState.invalid}
                              disabled={isSubmitting}
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
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                      <Controller
                        name="address"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field className="col-span-2" data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="student-address">Address</FieldLabel>
                            <Textarea
                              {...field}
                              id="student-address"
                              placeholder="Enter student address"
                              aria-invalid={fieldState.invalid}
                              disabled={isSubmitting}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    </FieldGroup>
                  </FieldSet>
                  <FieldSet>
                    <FieldLegend>Guardian Information</FieldLegend>
                    <FieldGroup className="grid grid-cols-2 gap-4">
                      <Controller
                        name="guardianName"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field className="col-span-2" data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="student-guardian-name">Name</FieldLabel>
                            <Textarea
                              {...field}
                              id="student-guardian-name"
                              placeholder="Enter guardian name"
                              aria-invalid={fieldState.invalid}
                              disabled={isSubmitting}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                      <Controller
                        name="guardianPhone"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="student-guardian-phone">Phone</FieldLabel>
                            <Input
                              {...field}
                              id="student-guardian-phone"
                              type="tel"
                              placeholder="Enter guardian phone"
                              aria-invalid={fieldState.invalid}
                              disabled={isSubmitting}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    </FieldGroup>
                  </FieldSet>
                </FieldGroup>
              </form>
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
                    <Button type="submit" form="student-form">
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
                    <Button type="submit" form="student-form">
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
                    <Button type="button" onClick={() => setIsEditing(true)}>
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

      {data && (
        <DeleteConfirmationDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title={`Delete student '${data.fullName}'`}
          description="Are you sure you want to delete this student?"
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
