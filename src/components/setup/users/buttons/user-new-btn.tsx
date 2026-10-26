"use client"
import UsersDialog from "@/components/dialog/users/users-dialog";
import { Button } from "@/components/shadcn/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export default function UserNewBtn() {
  const [isOpen, setIsOpen] = useState(false);

  function handleCreateUser() {}

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PlusIcon />
        Create user
      </Button>
      <UsersDialog open={isOpen} onOpenChange={setIsOpen} onSave={handleCreateUser} />
    </>
  );
}
