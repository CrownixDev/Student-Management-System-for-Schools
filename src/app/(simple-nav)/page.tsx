import { APP_URLS } from "@/constraints";
import { GraduationCapIcon, NotebookPenIcon, Wrench } from "lucide-react";
import NavButton from "@/components/simple-nav/nav-button";
import ButtonShell from "@/components/simple-nav/button-shell";
import { academicYearsService } from "@/features/academic-years";

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
    <>
      <ButtonShell>
        <NavButton href={`/grades?yearId=${yearId}`} icon={GraduationCapIcon}>
          Students
        </NavButton>
        <NavButton href={APP_URLS.simpleNav.exams.root} icon={NotebookPenIcon}>
          Exams
        </NavButton>
        <NavButton href={APP_URLS.simpleNav.setup} icon={Wrench}>
          Setup
        </NavButton>
      </ButtonShell>
    </>
  );
}
