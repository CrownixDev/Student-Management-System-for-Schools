import { GraduationCapIcon, NotebookPenIcon, Wrench } from "lucide-react";
import { academicYearsService } from "@/features/academic-years";
import { Button } from "@/components/shadcn/button";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function page() {
  const yearList = await academicYearsService.getList({});

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
            <Link href={`/grades?yearId=${yearId}`}>
              <Button className="flex w-full py text-2xl h-30 items-center" variant="outline">
                <GraduationCapIcon className="size-7" />
                Students
              </Button>
            </Link>
            <Link href={`/exams?yearId=${yearId}`}>
              <Button className="flex w-full py text-2xl h-30 items-center" variant="outline">
                <NotebookPenIcon className="size-7" />
                Exams
              </Button>
            </Link>
            <Link href={"/setup"}>
              <Button className="flex w-full py text-2xl h-30 items-center" variant="outline">
                <Wrench className="size-7" />
                Setup
              </Button>
            </Link>
          </nav>
        </div>
      </section>
    </main>
  );
}
