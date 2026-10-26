"use client";

import { Label } from "@/components/shadcn/label";
import { Switch } from "@/components/shadcn/switch";
import { IUser } from "@/features/user";

export default function UserStatusBtn({ user }: { user: IUser }) {
  function handleStatusChange(userId: string, checked: boolean) {
    console.log(userId, checked);
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        id={user.id + "status-btn"}
        checked={user.isActive}
        onCheckedChange={(checked) => handleStatusChange(user.id, checked)}
      />

      <Label htmlFor={user.id + "status-btn"} className="text-muted-foreground">
        {user.isActive ? "Active" : "Inactive"}
      </Label>
    </div>
  );
}
