"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { IClass } from "@/features/class";
import Fuse from "fuse.js";
import { useState } from "react";
import SearchInput from "@/components/ui/search-input";
import { Button } from "@/components/shadcn/button";
import { DownloadIcon } from "lucide-react";
export default function ClassStudentsTable({ enrollments }: { enrollments: IClass["enrollments"] }) {
  const [search, setSearch] = useState("");

  const fuse = new Fuse(enrollments, {
    useTokenSearch: true,
    keys: ["classIndex", "student.admissionNo", "student.fullName"],
  });
  const searchResult = fuse.search(search).map((r) => r.item);

  return (
    <div className="flex flex-col gap-5">
      <SearchInput
        placeholder="Search by student name, index or admission number"
        value={search}
        onChange={setSearch}
        onClear={() => setSearch("")}
      />
      <div className="overflow-hidden rounded-md border">
        <div className="max-h-[65vh] overflow-auto">
          <Table containerClassName="overflow-visible">
            <TableHeader className="sticky top-0 z-10 bg-muted">
              <TableRow>
                <TableHead>Index</TableHead>
                <TableHead>Admission no.</TableHead>
                <TableHead>Student</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchResult.map((enrollment) => (
                <TableRow key={enrollment.student.id}>
                  <TableCell className="font-mono">{enrollment.classIndex}</TableCell>
                  <TableCell className="font-mono">{enrollment.student.admissionNo}</TableCell>
                  <TableCell title={enrollment.student.fullName} className="max-w-25 truncate">
                    {enrollment.student.fullName}
                  </TableCell>
                </TableRow>
              ))}
              {searchResult.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    No students found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
