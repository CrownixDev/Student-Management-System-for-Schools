import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { userRoleSelectOptions } from "@/lib/select-options";
import { SearchIcon, UserRoundIcon } from "lucide-react";
import { IUser, userService } from "@/features/user";
import { Badge } from "@/components/shadcn/badge";
import { redirect } from "next/navigation";
import { userFilterCache } from "@/features/user/user.cache";
import { filterCache } from "@/lib/nuqs/filter";
import AssignmentHoverCard from "@/components/setup/users/assignment-hover-card";
import EmptyState from "@/components/ui/empty-state";
import UserManageBtn from "./buttons/user-manage-btn";
import UserStatusBtn from "./buttons/user-status-btn";
import PagePagination from "@/components/ui/page/page-pagination";
import { PageLayoutContent, PageLayoutFooter } from "@/components/ui/page/page-layout";

export default async function UserTable() {
  const role = userFilterCache.get("role");
  const search = filterCache.get("search");

  let users: IUser[] | null = null;

  try {
    users = await userService.getList({ search, role });
  } catch (error) {
    console.error("Failed to load users:", error);
    redirect("/setup");
  }

  return (
    <>
      <PageLayoutContent className="flex flex-col overflow-hidden">
        <div className="min-h-0 min-w-0 flex-1 overflow-auto rounded-lg border">
          <Table className="min-w-[900px]" containerClassName="!overflow-visible">
            <TableHeader>
              <TableRow>
                <TableHead className="sticky top-0 z-10 w-[26%] bg-background font-semibold">Account</TableHead>
                <TableHead className="sticky top-0 z-10 w-[18%] bg-background font-semibold">Role</TableHead>
                <TableHead className="sticky top-0 z-10 w-[26%] bg-background font-semibold">Assignments</TableHead>
                <TableHead className="sticky top-0 z-10 w-[15%] bg-background font-semibold">Status</TableHead>
                <TableHead className="sticky top-0 z-10 w-[15%] bg-background text-right font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <UserRoundIcon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium">{user.username}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {user.teacher?.fullName ?? "No teacher linked"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" || user.role === "mod" ? "default" : "outline"}>
                      {userRoleSelectOptions.find((opt) => opt.value === user.role)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    <AssignmentHoverCard user={user} />
                  </TableCell>
                  <TableCell>
                    <UserStatusBtn user={user} />
                  </TableCell>
                  <TableCell className="text-right">
                    <UserManageBtn user={user} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {users.length === 0 && (
            <div className="py-12">
              <EmptyState
                icon={SearchIcon}
                title={search || role ? "No matching users" : "No users yet"}
                description={
                  search || role ? "Try a different search or role filter." : "Create an account to get started."
                }
              />
            </div>
          )}
        </div>
      </PageLayoutContent>
      <PageLayoutFooter>
        <PagePagination itemCount={users.length} />
      </PageLayoutFooter>
    </>
  );
}
