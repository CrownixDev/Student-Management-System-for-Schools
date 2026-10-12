"use client";

import TeacherDialog from "@/components/dialog/teacher-dialog";
import { Button } from "@/components/shadcn/button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/shadcn/input-group";
import { Separator } from "@/components/shadcn/separator";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/shadcn/sidebar";
import { TypographyH1 } from "@/components/ui/typography";
import { ITeacherListItem } from "@/features/teachers";
import { ChevronLeftIcon, PlusIcon, SearchIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function TeachersSidebar({
  teacherList,
  isQuery = false,
}: {
  teacherList: ITeacherListItem[];
  isQuery?: boolean;
}) {
  const params = useParams();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  const selectedTeacherId = params?.teacherId;

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <Button variant={"outline"} onClick={() => router.replace("/nav/setup")}>
            <ChevronLeftIcon />
            Go Back
          </Button>
          <div className="flex flex-col gap-3 mb-3">
            <TypographyH1>All Teachers</TypographyH1>
            <Button variant={"outline"} className={"w-full"} onClick={() => setIsAdding(true)}>
              <PlusIcon className="size-3.5" aria-hidden="true" />
              Add a new teacher
            </Button>
          </div>
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search by Name or phone" />
            <InputGroupButton size={"sm"}>Clear</InputGroupButton>
          </InputGroup>

          <Separator />
        </SidebarHeader>
        <SidebarContent>
          <div className="min-h-0 flex-1 overflow-y-auto" aria-label="Teachers">
            {teacherList.map((teacher) => (
              <Link
                key={teacher.id}
                type="button"
                aria-pressed={selectedTeacherId === teacher.id}
                href={`/teachers/${teacher.id}`}
                className={`cursor-pointer flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${selectedTeacherId === teacher.id ? "bg-muted" : "bg-card"}`}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted-foreground/10 border border-muted">
                  <UserIcon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{teacher.fullName}</span>
                </span>
              </Link>
            ))}
          </div>
          {teacherList.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm font-medium">{isQuery ? "No teachers match this search." : "No teachers yet."}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {isQuery ? "Try another name or phone number." : "Add a teacher to get started."}
              </p>
            </div>
          )}
        </SidebarContent>
        <SidebarFooter>
          {/* <p className="text-sm text-muted-foreground">
          {formatPageRange(pageData.total, pageData.page, pageData.pageSize)}
        </p>
        <DirectoryPager
          page={pageData.page}
          pageCount={pageData.pageCount}
          previousHref={pageUrl(Math.max(1, pageData.page - 1))}
          nextHref={pageUrl(Math.min(pageData.pageCount, pageData.page + 1))}
          onPrevious={() => router.push(pageUrl(Math.max(1, pageData.page - 1)), { scroll: false })}
          onNext={() => router.push(pageUrl(Math.min(pageData.pageCount, pageData.page + 1)), { scroll: false })}
        /> */}
          <Separator />
          <p className="text-xs text-sidebar-foreground/60 text-center">A Project by CROWNIX</p>
        </SidebarFooter>
      </Sidebar>
      <TeacherDialog open={isAdding} onOpenChange={setIsAdding} />
    </>
  );
}
