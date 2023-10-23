"use client";

import { DataTable } from "~/components/ui/datatable/data-table";
import { genreOptions, statusOptions, typeOptions } from "~/lib/options";
import { PublicWatchlistColumns, type WatchlistColumn } from "./columns";

export default function PublicDataTableView({
  data,
}: {
  data: WatchlistColumn[];
}) {
  const filters = [
    {
      columnId: "type",
      title: "Type",
      options: typeOptions,
    },
    {
      columnId: "status",
      title: "Status",
      options: statusOptions,
    },
    {
      columnId: "genres",
      title: "Genres",
      options: genreOptions,
    },
  ];

  return (
    <DataTable
      columns={PublicWatchlistColumns()}
      data={data}
      filters={filters}
      isLoading={false}
    />
  );
}
