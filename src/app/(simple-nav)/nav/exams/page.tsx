import { academicYearsRepository } from "@/features/academic-years";
import BackButton from "@/components/simple-nav/back-button";
import ButtonShell from "@/components/simple-nav/button-shell";
import NavButton from "@/components/simple-nav/nav-button";
import { Route } from "next";

export default async function page() {
  const academicYearList = await academicYearsRepository.getList({});

  return (
    <ButtonShell backButton={<BackButton href="/" />}>
      {academicYearList.map((year) => {
        return (
          <NavButton key={year.name} href={`/exams?yearId=${year.id}` as Route}>
            {year.name}
          </NavButton>
        );
      })}
    </ButtonShell>
  );
}
