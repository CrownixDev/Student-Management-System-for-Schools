"use client";

import { Button } from "@/components/shadcn/button";
import { IUser } from "@/features/user";
import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import UsersActionConfirmDialog from "@/components/dialog/users/users-action-confirm-dialog";
import UsersDialog from "@/components/dialog/users/users-dialog";

export default function UserManageBtn({ user }: { user: IUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmErrors, setConfirmErrors] = useState<string[]>();
  function handleSave() {
    setIsConfirmOpen(true);
  }

  function handleConfirmChanges() {
    setConfirmErrors(["Invalid Password"]);
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <MoreHorizontalIcon />
        Manage
      </Button>
      {isOpen && <UsersDialog open={isOpen} onOpenChange={setIsOpen} onSave={handleSave} data={user} />}
      {isConfirmOpen && (
        <UsersActionConfirmDialog
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          onConfirm={handleConfirmChanges}
          initialErrors={confirmErrors}
        />
      )}
    </>
  );
}
