import { TypographyH1 } from "@/components/ui/typography";
import { Suspense } from "react";
import { userFilterCache } from "@/features/user/user.cache";
import { filterCache } from "@/lib/nuqs/filter";
import { PageLayout, PageLayoutHeader } from "@/components/ui/page/page-layout";
import LoadingIndicator from "@/components/ui/loading-indicator";
import UserFilterBtn from "@/components/setup/users/buttons/user-filter-btn";
import UserContent from "@/components/setup/users/user-content";
import SearchInput from "@/components/ui/search-input";
import UserNewBtn from "@/components/setup/users/buttons/user-new-btn";

export default async function UsersPage({ searchParams }: PageProps<"/setup/users">) {
  await userFilterCache.parse(searchParams);
  await filterCache.parse(searchParams);

  return (
    <PageLayout className="p-5">
      <PageLayoutHeader className="space-y-6">
        <div className="flex w-full items-center justify-between gap-3">
          <TypographyH1>Users</TypographyH1>
          <UserNewBtn />
        </div>
        <div className="flex w-full items-center gap-3">
          <SearchInput placeholder="Search users or teachers..." />
          <UserFilterBtn />
        </div>
      </PageLayoutHeader>
      <Suspense fallback={<LoadingIndicator />}>
        <UserContent />
      </Suspense>
    </PageLayout>
  );
}
