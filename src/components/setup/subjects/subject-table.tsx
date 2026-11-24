import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { filterCache } from "@/lib/nuqs/filter";
import { SubjectCategory } from "@/generated/prisma/enums";
import { LibraryBig } from "lucide-react";
import { getServerCaller } from "@/lib/orpc/server-caller";
import { safe } from "@orpc/client";
import EmptyState from "@/components/ui/empty-state";
import SubjectEditBtn from "./buttons/subject-edit-btn";
import ErrorState from "@/components/ui/error-state";

export default async function SubjectTable({ category }: { category: SubjectCategory }) {
  const search = filterCache.get("search");
  const caller = await getServerCaller();
  const { data: subjects, error, definedError } = await safe(caller.subject.getList({ search, category }));

  if (error) {
    return (
      <ErrorState
        noBorder
        type="normal"
        title={definedError ? error.message : "Error loading subject list"}
        description="Failed to load subject list. Please try reloading the page."
      />
    );
  }

  return (
    <div className="flex-1 border rounded-lg overflow-auto">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="font-semibold text-foreground">Name</TableHead>
            <TableHead className="font-semibold text-foreground">Code</TableHead>
            <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.map((subject) => {
            return (
              <TableRow key={subject.id}>
                <TableCell className="font-medium">{subject.name}</TableCell>
                <TableCell className="font-medium">{subject.code ?? "-"}</TableCell>
                <TableCell className="text-right">
                  <SubjectEditBtn subject={subject} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {subjects.length === 0 && (
        <div className="py-12">
          <EmptyState
            icon={LibraryBig}
            title={search ? "No subjects match this search and category." : "No subjects yet in this category."}
            description={search ? "Try a different search." : "Add a subject to get started."}
          />
        </div>
      )}
    </div>
  );
}
