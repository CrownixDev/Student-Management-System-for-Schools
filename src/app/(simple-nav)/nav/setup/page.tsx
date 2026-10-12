import { APP_URLS } from "@/constraints/url";
import { GraduationCapIcon, LibraryBigIcon, UsersIcon, WaypointsIcon } from "lucide-react";
import NavButton from "../../../../components/simple-nav/nav-button";
import ButtonShell from "../../../../components/simple-nav/button-shell";
import BackButton from "../../../../components/simple-nav/back-button";

export default function page() {
  return (
    <ButtonShell backButton={<BackButton href="/"/>}>
      <NavButton href={APP_URLS.simpleNav.setup.streams} icon={WaypointsIcon}>
        Streams
      </NavButton>
      <NavButton href={APP_URLS.simpleNav.setup.grades} icon={GraduationCapIcon}>
        Grades
      </NavButton>
      <NavButton href={APP_URLS.simpleNav.setup.subjects} icon={LibraryBigIcon}>
        Subjects
      </NavButton>
      <NavButton href={APP_URLS.simpleNav.setup.teacher} icon={UsersIcon}>
        Teachers
      </NavButton>
    </ButtonShell>
  );
}
