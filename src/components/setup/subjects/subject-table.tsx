import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { filterCache } from "@/lib/nuqs/filter";
import { redirect } from "next/navigation";
import { SubjectCategory } from "@/generated/prisma/enums";
import EmptyState from "@/components/ui/empty-state";
import { LibraryBig } from "lucide-react";
import SubjectEditBtn from "./buttons/subject-edit-btn";
import { ISubjectListItem, subjectService } from "@/features/subjects";

export default async function SubjectTable({ category }: { category: SubjectCategory }) {
  const search = filterCache.get("search");

  let subjects: ISubjectListItem[] | null = null;

  try {
    subjects = await subjectService.getList({ search, category });
  } catch (error) {
    console.error("Failed to load batches:", error);
    redirect("/setup");
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
                <TableCell className="font-medium">{subject.code}</TableCell>
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
