"use client";

import { Button } from "@/components/shadcn/button";
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/shadcn/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { ListFilterIcon } from "lucide-react";
import { userRoleSelectOptions } from "@/lib/select-options";
import { useQueryStates } from "nuqs";
import { userFilterParsers } from "@/features/user/user.cache";

const userRoleFilterOptions = [{ value: "all", label: "All" }, ...userRoleSelectOptions];

export default function UserFilterBtn() {
  const [{ role }, setParsers] = useQueryStates(userFilterParsers);
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant={role === "all" ? "outline" : "default"} className="shrink-0">
            <ListFilterIcon />
            Filter{role !== "all" && <span className="ml-1">· 1</span>}
          </Button>
        }
      />
      <PopoverContent align="start">
        <PopoverHeader>
          <PopoverTitle>Filter users by role</PopoverTitle>
        </PopoverHeader>
        <Select items={userRoleFilterOptions} value={role} onValueChange={(value) => setParsers({ role: value })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            {userRoleFilterOptions.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {role !== "all" && (
          <Button variant="ghost" size="sm" onClick={() => setParsers({ role: null })}>
            Clear filter
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
