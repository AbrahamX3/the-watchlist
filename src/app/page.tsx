import { type Prisma } from "@prisma/client";
import { Toaster } from "sonner";

import TableContainer from "~/components/ui/datatable/data-table-container";
import DataTableHeader from "~/components/ui/datatable/data-table-header";
import { api } from "~/trpc/server";
import WatchlistActionCreate from "./_components/create";
import DataTableView from "./_components/data-table-view";
import SiteHeader from "./_components/header";

export type WatchlistColumn = Prisma.WatchlistGetPayload<object>;
export default async function Dashboard() {
  const data = await api.watchlist.getAll.query();

  return (
    <>
      <SiteHeader />
      <TableContainer>
        <DataTableHeader mobileTitle="Watchlist" desktopTitle="Watchlist">
          <WatchlistActionCreate />
        </DataTableHeader>
        <DataTableView data={data} />
        <Toaster richColors position="bottom-left" />
      </TableContainer>
    </>
  );
}
