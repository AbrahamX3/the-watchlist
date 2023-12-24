"use client";

import { type Prisma } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "~/components/ui/datatable/data-table-column-header";
import DataTableLabelId from "~/components/ui/datatable/data-table-label-id";
import { genreOptions, statusOptions, typeOptions } from "~/lib/options";

import { WatchlistActions } from "./actions";

export type WatchlistColumn = Prisma.WatchlistGetPayload<object>;

export function DashboardWatchlistColumns() {
  const columns: ColumnDef<WatchlistColumn>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Id" />
      ),
      cell: ({ row }) => {
        return <DataTableLabelId id={row.getValue("id")} />;
      },
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("title")}
            </span>
          </div>
        );
      },
    },
    {
      id: "Year",
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Year" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {new Date(row.getValue("Year")).getFullYear()}
            </span>
          </div>
        );
      },
      filterFn: (row, id, value: string) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "rating",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rating" />
      ),

      cell: ({ row }) => {
        const rating = Number(row.getValue("rating")).toFixed(1);
        return (
          <div className="flex space-x-2">
            <span
              title={`${rating} / 10`}
              className="max-w-[500px] truncate font-medium"
            >
              {Number(row.getValue("rating")).toFixed(1)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "genres",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Genres" />
      ),
      cell: ({ row }) => {
        const genres = genreOptions
          .filter((genre) =>
            row.getValue<number[]>("genres").includes(genre.value),
          )
          .map((genre) => genre.label);

        if (!genres) {
          return null;
        }

        return (
          <div className="flex w-[100px] items-center">
            <span>{genres.join(", ")}</span>
          </div>
        );
      },
      filterFn: (row, id, value: string[]) => {
        return value.every((val: string) =>
          row.getValue<string[]>(id).includes(val),
        );
      },
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => {
        const type = typeOptions.find(
          (type) => type.value === row.getValue("type"),
        );

        if (!type) {
          return null;
        }

        return (
          <div className="flex w-[100px] items-center">
            {type.icon && (
              <type.icon className="mr-2 h-4 w-4 text-muted-foreground" />
            )}
            <span>{type.label}</span>
          </div>
        );
      },
      filterFn: (row, id, value: string) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = statusOptions.find(
          (status) => status.value === row.getValue("status"),
        );

        if (!status) {
          return null;
        }

        return (
          <div className="flex w-[100px] items-center">
            {status.icon && (
              <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
            )}
            <span>{status.label}</span>
          </div>
        );
      },
      filterFn: (row, id, value: string) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return <WatchlistActions row={row} />;
      },
    },
  ];

  return columns;
}
