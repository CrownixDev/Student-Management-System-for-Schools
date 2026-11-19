import { GraduationCapIcon, NotebookPenIcon, OctagonAlertIcon, Wrench } from "lucide-react";
import { getServerCaller } from "@/lib/orpc/server-caller";
import { Button } from "@/components/shadcn/button";
import { IAcademicYear } from "@/features/academic-years";
import EmptyState from "@/components/ui/empty-state";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function page() {
  let yearList: IAcademicYear[] | null = null;

  try {
    const caller = await getServerCaller();
    yearList = await caller.academicYear.getlist({ search: "" });
  } catch {
    return (
      <div className="flex h-screen w-full items-center justify-center ">
        <EmptyState
          noBorder
          icon={OctagonAlertIcon}
          title="Error loading academic years"
          description="Failed to load academic years. Please try reloading the page. If the problem persists, contact support (+94 77 65 65 800)."
        />
      </div>
    );
  }

  let yearId = "";

  if (yearList.length) {
    const activeYear = yearList.find((y) => y.isCurrent);
    if (activeYear) {
      yearId = activeYear.id;
    } else {
      yearId = yearList[0].id;
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-muted p-12">
      <section className="grid min-h-152 w-full max-w-5xl grid-cols-[0.9fr_1.1fr] overflow-hidden rounded-3xl bg-card shadow-2xl ring-1 ring-foreground/10">
        <div className="flex items-center justify-center bg-(--brand)">
          <div className="flex size-full items-center justify-center rounded-3xl ">
            <Image
              src="/crownix_logo.svg"
              alt="Crownix"
              width={1000}
              height={1000}
              className="size-full object-contain"
              priority
            />
          </div>
        </div>
        <div className="flex flex-col justify-center gap-8 p-12">
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground">
            Crownix Student Management System
          </h1>
          <nav aria-label="Main navigation" className="flex flex-col gap-4">
            <Button
              disabled={yearList.length === 0}
              className="flex w-full py text-2xl h-30 items-center"
              variant="outline"
            >
              <Link href={`/grades?yearId=${yearId}`} className="flex gap-2 w-full h-full items-center justify-center">
                <GraduationCapIcon className="size-7" />
                Students
              </Link>
            </Button>
            <Button
              disabled={yearList.length === 0}
              className="flex w-full py text-2xl h-30 items-center"
              variant="outline"
            >
              <Link href={`/exams?yearId=${yearId}`} className="flex gap-2 w-full h-full items-center justify-center">
                <NotebookPenIcon className="size-7" />
                Exams
              </Link>
            </Button>
            <Button className="flex w-full py text-2xl h-30 items-center" variant="outline">
              <Link href={"/setup"} className="flex gap-2 w-full h-full items-center justify-center">
                <Wrench className="size-7" />
                Setup
              </Link>
            </Button>
          </nav>
        </div>
      </section>
    </main>
  );
}
