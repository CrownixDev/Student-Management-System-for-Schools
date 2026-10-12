import { APP_URLS } from "@/constraints/url";
import NavButton from "../../../../components/simple-nav/nav-button";
import { CalendarDaysIcon, LinkIcon } from "lucide-react";
import BackButton from "../../../../components/simple-nav/back-button";
import ButtonShell from "../../../../components/simple-nav/button-shell";

export default function page() {
  return (
    <ButtonShell backButton={<BackButton href="/"/>}>
      <NavButton href={APP_URLS.simpleNav.student.year} icon={CalendarDaysIcon}>
        Year
      </NavButton>
      <NavButton href={APP_URLS.simpleNav.student.batch} icon={LinkIcon}>
        Batch
      </NavButton>
    </ButtonShell>
  );
}
