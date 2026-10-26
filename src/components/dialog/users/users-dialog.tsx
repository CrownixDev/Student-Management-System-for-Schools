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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Switch } from "@/components/shadcn/switch";
import { EyeIcon, EyeOffIcon, LibraryBigIcon, UserRoundIcon, UsersIcon } from "lucide-react";
import { useState } from "react";
import { IUser } from "@/features/user";
import { userRoleSelectOptions } from "@/lib/select-options";
import ClassPickerDialog from "../class-picker-dialog";
import SubjectPickerDialog from "../subject-picker-dialog";
import TeacherPickerDialog from "../teacher-picker-dialog";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/shadcn/input-group";
import { cn } from "cn";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/components/shadcn/field";

export default function UsersDialog({
  open,
  onOpenChange,
  data,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: IUser;
  onSave: () => void;
}) {
  type UserType = IUser & { password: string };
  const INITIAL_DATA = {
    id: data?.id ?? "",
    username: data?.username ?? "",
    password: "",
    role: data?.role ?? "mod",
    isActive: data?.isActive ?? true,
    teacher: data?.teacher ?? null,
    classes: data?.classes ?? [],
    subjects: data?.subjects ?? [],
  } satisfies UserType;

  const [user, setUser] = useState<UserType>(INITIAL_DATA);
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [teacherDialogOpen, setTeacherDialogOpen] = useState(false);
  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleSave() {
    onSave();
  }

  const settingsHidden = user.role === "admin";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[90dvh] min-h-0 min-w-xl flex-col overflow-hidden">
          <DialogHeader className="shrink-0">
            <DialogTitle>{data ? "Manage user" : "Create user"}</DialogTitle>
            <DialogDescription>
              {data
                ? "Update the account details and assignments."
                : "Set up sign-in details and choose a role for this account."}
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 min-w-0 flex-1 space-y-5 overflow-x-hidden overflow-y-auto">
            <FieldGroup>
              <FieldSet>
                <FieldGroup className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="user-username">Username</FieldLabel>
                    <Input
                      id="user-username"
                      autoComplete="username"
                      required
                      value={user.username}
                      onChange={(event) => setUser((prev) => ({ ...prev, username: event.target.value }))}
                      placeholder="e.g. alex.perera"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="user-password">{data ? "New password" : "Password"}</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="user-password"
                        type={showPassword ? "text" : "password"}
                        required={!data}
                        value={user.password}
                        onChange={(event) => setUser((prev) => ({ ...prev, password: event.target.value }))}
                        placeholder={data ? "Leave blank to keep current" : "Enter a password"}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton onClick={() => setShowPassword((prev) => !prev)}>
                          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {data && (
                      <p className={cn("text-xs text-muted-foreground", user.password && "text-destructive")}>
                        Only enter a password if you want to change it.
                      </p>
                    )}
                  </Field>
                </FieldGroup>
              </FieldSet>
              {!settingsHidden && (
                <>
                  <FieldSeparator />
                  <FieldSet>
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="user-role">Role</FieldLabel>
                        <Select
                          items={userRoleSelectOptions}
                          value={user.role}
                          onValueChange={(value) => value && setUser((prev) => ({ ...prev, role: value }))}
                        >
                          <SelectTrigger id="user-role" className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {userRoleSelectOptions.map((opt) => {
                              // Don't map admin as a option
                              if (opt.value !== "admin") {
                                return (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                );
                              }
                            })}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <div className="rounded-lg border p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <Label htmlFor="user-active">Account status</Label>
                              <p className="mt-1 text-xs text-muted-foreground">Inactive users cannot sign in.</p>
                            </div>
                            <Switch
                              id="user-active"
                              checked={user.isActive}
                              onCheckedChange={(isActive) => setUser((prev) => ({ ...prev, isActive }))}
                            />
                          </div>
                        </div>
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                  <FieldSeparator />
                  <FieldSet>
                    <FieldLegend>Assignments</FieldLegend>
                    <FieldGroup className="-space-y-3">
                      <Field>
                        <div className="flex w-full min-w-0 gap-2 ">
                          <Button
                            type="button"
                            variant="outline"
                            className="justify-start flex-1"
                            onClick={() => setTeacherDialogOpen(true)}
                          >
                            <UserRoundIcon />
                            <span className="min-w-0 flex-1 whitespace-normal wrap-break-word text-left">
                              {user.teacher?.fullName ?? "Assign a teacher"}
                            </span>
                            <span className="shrink-0 whitespace-nowrap text-xs text-muted-foreground">
                              {user.teacher ? "Change" : "Optional"}
                            </span>
                          </Button>
                          {user.teacher && (
                            <Button variant="ghost" onClick={() => setUser((prev) => ({ ...prev, teacher: null }))}>
                              Clear
                            </Button>
                          )}
                        </div>
                      </Field>
                      <Field>
                        {!(user.role === "admin" || user.role === "mod") && (
                          <div className="flex w-full min-w-0 gap-2 ">
                            <Button
                              type="button"
                              variant="outline"
                              className="flex-1 justify-start"
                              onClick={() => setClassDialogOpen(true)}
                            >
                              <UsersIcon />
                              <span className="min-w-0 flex-1 whitespace-normal wrap-break-word text-left">
                                {user.classes.length ? user.classes.map((c) => c.name).join(", ") : "Assign a classes"}
                              </span>
                              <span className="shrink-0 whitespace-nowrap text-xs text-muted-foreground">
                                {user.classes.length ? "Change" : "Required"}
                              </span>
                            </Button>
                            {user.classes.length > 0 && (
                              <Button variant="ghost" onClick={() => setUser((prev) => ({ ...prev, classes: [] }))}>
                                Clear
                              </Button>
                            )}
                          </div>
                        )}
                      </Field>
                      <Field>
                        {user.role === "subject_teacher" && (
                          <div className="flex w-full min-w-0 gap-2 ">
                            <Button
                              type="button"
                              variant="outline"
                              className="flex-1 justify-start"
                              onClick={() => setSubjectDialogOpen(true)}
                            >
                              <LibraryBigIcon />
                              <span className="min-w-0 flex-1 whitespace-normal wrap-break-word text-left">
                                {user.subjects.length
                                  ? user.subjects.map((subject) => subject.name).join(", ")
                                  : "Assign subjects"}
                              </span>
                              <span className="shrink-0 whitespace-nowrap text-xs text-muted-foreground">
                                {user.subjects.length ? "Change" : "Required"}
                              </span>
                            </Button>
                            {user.subjects.length > 0 && (
                              <Button variant="ghost" onClick={() => setUser((prev) => ({ ...prev, subjects: [] }))}>
                                Clear
                              </Button>
                            )}
                          </div>
                        )}
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                </>
              )}
            </FieldGroup>
          </div>

          <DialogFooter className="shrink-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                ((!(user.role === "admin" || user.role === "mod") && user.classes.length === 0) ||
                  (user.role === "subject_teacher" && user.subjects.length === 0)) &&
                user.isActive
              }
            >
              {data ? "Save changes" : "Create user"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {classDialogOpen && (
        <ClassPickerDialog
          open={classDialogOpen}
          onOpenChange={setClassDialogOpen}
          onSelect={(classItems) => setUser((prev) => ({ ...prev, classes: [...prev.classes, ...classItems] }))}
        />
      )}

      {subjectDialogOpen && (
        <SubjectPickerDialog
          open={subjectDialogOpen}
          onOpenChange={setSubjectDialogOpen}
          selectedSubjectIds={user.subjects.map((subject) => subject.id)}
          onAdd={(subjects) => setUser((prev) => ({ ...prev, subjects: [...prev.subjects, ...subjects] }))}
          title="Assign subjects to user"
        />
      )}

      {teacherDialogOpen && (
        <TeacherPickerDialog
          open={teacherDialogOpen}
          onOpenChange={setTeacherDialogOpen}
          selectedTeacherId={user.teacher?.id}
          onSelect={(teacher) => setUser((prev) => ({ ...prev, teacher }))}
          title="Assign a teacher to this account"
        />
      )}
    </>
  );
}
