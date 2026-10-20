import BackButton from "@/components/simple-nav/back-button";
import ButtonShell from "@/components/simple-nav/button-shell";
import NavButton from "@/components/simple-nav/nav-button";
import { batchService } from "@/features/batch";
import { Route } from "next";

export default async function page() {
  const batchList = await batchService.getList({});

  return (
    <ButtonShell backButton={<BackButton href="/nav/student" />}>
      {batchList.map((batch) => {
        return (
          <NavButton key={batch.name} href={`/grades?batchId=${batch.id}` as Route}>
            {batch.name}
          </NavButton>
        );
      })}
    </ButtonShell>
  );
}
