import { type Metadata } from "next";
import { type Prisma } from "@prisma/client";

import TableContainer from "~/components/ui/datatable/data-table-container";
import DataTableHeader from "~/components/ui/datatable/data-table-header";
import { Toaster } from "~/components/ui/sonner";
import { api } from "~/trpc/server";

import WatchlistActionCreate from "./_components/create";
import DashboardDataTableView from "./_components/data-table-view";
import SiteHeader from "./_components/header";

export type WatchlistColumn = Prisma.WatchlistGetPayload<object>;

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Dashboard() {
  const data = await api.watchlist.getAll.query();

  return (
    <>
      <SiteHeader />
      <TableContainer>
        <DataTableHeader mobileTitle="Watchlist" desktopTitle="Watchlist">
          <WatchlistActionCreate />
        </DataTableHeader>
        <DashboardDataTableView data={data} />
        <Toaster richColors position="bottom-left" />
      </TableContainer>
    </>
  );
}
