import { Badge } from "@/components/shadcn/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { filterCache } from "@/lib/nuqs/filter";
import { CalendarsIcon, OctagonAlertIcon } from "lucide-react";
import { PageLayoutContent, PageLayoutFooter } from "@/components/ui/page/page-layout";
import { safe } from "@orpc/client";
import { getServerCaller } from "@/lib/orpc/server-caller";
import PagePagination from "@/components/ui/page/page-pagination";
import EmptyState from "@/components/ui/empty-state";
import YearsEditBtn from "./buttons/years-edit-btn";
import YearsSetCurrentBtn from "./buttons/years-set-current-btn";

export default async function YearsContent() {
  const search = filterCache.get("search");
  const caller = await getServerCaller();
  const { data: years, error, definedError } = await safe(caller.academicYear.getlist({ search }));

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center absolute backdrop-blur-xs top-0 left-0">
        <EmptyState
          noBorder
          icon={OctagonAlertIcon}
          title={definedError ? error.message : "Error loading academic years"}
          description="Failed to load academic years. Please try reloading the page. If the problem persists, contact support (+94 77 65 65 800)."
        />
      </div>
    );
  }

  return (
    <>
      <PageLayoutContent className="flex flex-col overflow-hidden py-5">
        <div className="flex-1 overflow-auto rounded-lg border">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="font-semibold text-foreground">Academic Year</TableHead>
                <TableHead className="font-semibold text-foreground">Status</TableHead>
                <TableHead className="font-semibold text-foreground">Start Date</TableHead>
                <TableHead className="font-semibold text-foreground">End Date</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {years.map((year) => {
                return (
                  <TableRow key={year.id} className={year.isCurrent ? "bg-muted/20" : undefined}>
                    <TableCell>{year.name}</TableCell>

                    <TableCell>
                      {year.isCurrent ? (
                        <Badge variant="success">Current Active Year</Badge>
                      ) : (
                        <Badge variant="outline">Past</Badge>
                      )}
                    </TableCell>

                    <TableCell className="font-mono">{year.startDate.toLocaleDateString("si-LK")}</TableCell>

                    <TableCell className="font-mono">{year.endDate.toLocaleDateString("si-LK")}</TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <YearsSetCurrentBtn year={year} />
                        <YearsEditBtn year={year} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {years.length === 0 && (
            <div className="py-12">
              <EmptyState
                icon={CalendarsIcon}
                title={search ? "No matching academic years" : "No academic years found"}
                description={
                  search
                    ? `No academic years match "${search}". Try searching for another year.`
                    : "Get started by adding the first academic year."
                }
              />
            </div>
          )}
        </div>
      </PageLayoutContent>
      <PageLayoutFooter>
        <PagePagination itemCount={years.length} />
      </PageLayoutFooter>
    </>
  );
}
