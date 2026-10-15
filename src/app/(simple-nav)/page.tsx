import { APP_URLS } from "@/constraints/url";
import { GraduationCapIcon, NotebookPenIcon, ServerCogIcon, SettingsIcon } from "lucide-react";
import NavButton from "../../components/simple-nav/nav-button";
import ButtonShell from "../../components/simple-nav/button-shell";

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
        <NavButton href={APP_URLS.simpleNav.setup.root} icon={ServerCogIcon}>
          Setup
        </NavButton>
        <NavButton href={APP_URLS.simpleNav.settings} icon={SettingsIcon}>
          Settings
        </NavButton>
      </ButtonShell>
    </>
  );
}
