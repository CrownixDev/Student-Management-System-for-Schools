"use client";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { TypographyH2 } from "@/components/ui/typography";

import { DotIcon, PencilIcon } from "lucide-react";
import { ITeacher } from "@/features/teachers";
import TeacherDialog from "@/components/dialog/teacher-dialog";
import { useState } from "react";

export default function TeacherDetails({ teacher }: { teacher: ITeacher }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <div className="overflow-y-auto mx-auto w-full max-w-5xl space-y-8 px-16 py-8">
        <div className="flex items-start justify-between gap-5">
          <div className="flex items-center gap-4">
            <div>
              <TypographyH2 className="text-2xl">{teacher.fullName}</TypographyH2>
              <p className="mt-1 text-md text-muted-foreground">{teacher.phone ?? "Phone not listed"}</p>
              <Badge className="mt-2" variant={teacher.isActive ? "success" : "destructive"}>
                {teacher.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <PencilIcon className="size-4" aria-hidden="true" />
            Edit teacher
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 border-y border-border py-4">
          <div>
            <p className="text-sm text-muted-foreground">Class teacher of</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">Grade 8A</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Subject assignments</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">{teacher.subjects.length}</p>
          </div>
        </div>
        <section className="space-y-3">
          <div>
            <TypographyH2>Class teacher assignments</TypographyH2>
          </div>
          {teacher.classesAsClassTeacher.length > 0 ? (
            <div className="flex flex-col gap-2">
              {teacher.classesAsClassTeacher.map((assignment) => (
                <div key={assignment.id} className="flex gap-3">
                  <DotIcon />
                  <div className="flex gap-5">
                    <p className="text-muted-foreground">
                      <span className="text-black">Year:</span> {assignment.academicYear.name}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="text-black">Class:</span> {assignment.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-y border-border py-4 text-sm text-muted-foreground">
              No class-teacher assignments
            </div>
          )}
        </section>
        <section className="space-y-3">
          <div>
            <TypographyH2>Subject assignments</TypographyH2>
          </div>
          {teacher.subjects.length ? (
            <div className="divide-y divide-border border-y border-border">
              {teacher.subjects.map((subject) => (
                <div key={subject?.medium + subject.name} className="flex gap-3">
                  <DotIcon />
                  <div className="flex gap-5">
                    <p className="text-muted-foreground">
                      <span className="text-black">Class:</span> {subject.class}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="text-black">Subject:</span> {subject.name}
                    </p>
                    {subject.medium && (
                      <p className="text-muted-foreground">
                        <span className="text-black">Medium:</span> {subject.medium}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-y border-border py-4 text-sm text-muted-foreground">No subject assignments</div>
          )}
        </section>
      </div>
      <TeacherDialog open={isEditing} onOpenChange={setIsEditing} data={teacher} />
    </>
  );
}
