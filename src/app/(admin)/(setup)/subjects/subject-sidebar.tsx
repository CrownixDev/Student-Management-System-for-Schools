"use client";

import SubjectDialog, { subjectCategories } from "@/components/dialog/subject-dialog";
import { Button } from "@/components/shadcn/button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/shadcn/input-group";
import { Separator } from "@/components/shadcn/separator";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/shadcn/sidebar";
import { TypographyH1 } from "@/components/ui/typography";
import { ISubjectListItem } from "@/features/subjects/subject.types";
import { BookOpenCheckIcon, ChevronLeftIcon, PlusIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function SubjectSidebar({
  subjectList,
  isQuery = false,
}: {
  subjectList: ISubjectListItem[];
  isQuery?: boolean;
}) {
  const router = useRouter();
  const params = useParams();
  const selectedId = params?.subjectId;

  const [isAddingSubject, setIsAddingSubject] = useState(false);

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <Button variant={"outline"} onClick={() => router.push("/nav/setup")}>
            <ChevronLeftIcon />
            Go Back
          </Button>
          <div className="flex flex-col gap-3 mb-3">
            <TypographyH1>All Subjects</TypographyH1>
            <Button variant={"outline"} className={"w-full"} onClick={() => setIsAddingSubject(true)}>
              <PlusIcon className="size-3.5" aria-hidden="true" />
              Add a new subject
            </Button>
          </div>
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search by Name, code, or category" />
            <InputGroupButton size={"sm"}>Clear</InputGroupButton>
          </InputGroup>
          <Separator />
        </SidebarHeader>
        <SidebarContent>
          <div className="min-h-0 flex-1 overflow-y-auto" aria-label="Subjects">
            {subjectList.map((subject) => {
              const category = subjectCategories.filter((cat) => cat.value === subject.category)[0].label;
              return (
                <Link
                  key={subject.id}
                  type="button"
                  href={`/subjects/${subject.id}`}
                  className={`flex w-full cursor-pointer items-start gap-3 border-b border-border/70 px-4 py-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${selectedId === subject.id ? "bg-muted" : "bg-card"}`}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted-foreground/10  border border-muted">
                    <BookOpenCheckIcon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{subject.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{category}</span>
                  </span>
                </Link>
              );
            })}
            {subjectList.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm font-medium">{isQuery ? "No subjects match this search." : "No subjects yet."}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {isQuery ? "Try a different search." : "Add a subject to get started."}
                </p>
              </div>
            )}
          </div>
        </SidebarContent>
        <SidebarFooter>
          {/* <p className="text-xs text-muted-foreground">
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
        </SidebarFooter>
      </Sidebar>
      <SubjectDialog open={isAddingSubject} onOpenChange={setIsAddingSubject} />
    </>
  );
}
