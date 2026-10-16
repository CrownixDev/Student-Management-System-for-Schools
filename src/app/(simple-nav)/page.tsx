import { APP_URLS } from "@/constraints/url";
import { GraduationCapIcon, NotebookPenIcon, Wrench } from "lucide-react";
import NavButton from "@/components/simple-nav/nav-button";
import ButtonShell from "@/components/simple-nav/button-shell";

export default function page() {
  return (
    <>
      <ButtonShell>
        <NavButton href={APP_URLS.simpleNav.student.root} icon={GraduationCapIcon}>
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
