import { TypographyH1 } from "@/components/ui/typography";
import UserFilterBtn from "@/components/setup/users/buttons/user-filter-btn";
import UserTable from "@/components/setup/users/user-table";
import SearchInput from "@/components/ui/search-input";
import UserNewBtn from "@/components/setup/users/buttons/user-new-btn";
import { Separator } from "@/components/shadcn/separator";
import { Suspense } from "react";
import LoadingIndicator from "@/components/ui/loading-indicator";
import { userFilterCache } from "@/features/user/user.cache";
import { filterCache } from "@/lib/nuqs/filter";
import { PageLayout, PageLayoutHeader } from "@/components/ui/page/page-layout";

export default async function UsersPage({ searchParams }: PageProps<"/setup/users">) {
  await userFilterCache.parse(searchParams);
  await filterCache.parse(searchParams);

  return (
    <PageLayout>
      <PageLayoutHeader className="space-y-6">
        <div className="flex w-full items-center justify-between gap-3">
          <TypographyH1>Users</TypographyH1>
          <UserNewBtn />
        </div>
        <div className="flex w-full items-center gap-3">
          <SearchInput placeholder="Search users or teachers..." />
          <UserFilterBtn />
        </div>
        <Separator />
      </PageLayoutHeader>
      <Suspense fallback={<LoadingIndicator />}>
        <UserTable />
      </Suspense>
    </PageLayout>
  );
}
