import { type Prisma } from "@prisma/client";

import TableContainer from "~/components/ui/datatable/data-table-container";
import DataTableHeader from "~/components/ui/datatable/data-table-header";
import { Toaster } from "~/components/ui/sonner";
import { api } from "~/trpc/server";

import PublicDataTableView from "./_components/data-table-view";
import SiteHeader from "./_components/header";

export type WatchlistColumn = Prisma.WatchlistGetPayload<object>;
export default async function HomePage() {
  const data = await api.watchlist.getAll.query();

  return (
    <>
      <SiteHeader />
      <TableContainer>
        <DataTableHeader
          mobileTitle="My Personal Watchlist"
          desktopTitle="My Personal Watchlist"
        />
        <PublicDataTableView data={data} />
        <Toaster richColors position="bottom-left" />
      </TableContainer>
    </>
  );
}
