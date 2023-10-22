import { useState } from "react";
import { type Row } from "@tanstack/react-table";
import { Info, MoreHorizontal } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { type WatchlistColumn } from "./columns";
import WatchlistActionDescription from "./description";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}
export function WatchlistActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const data = row.original as WatchlistColumn;
  const [descriptionModal, setDescriptionModal] = useState(false);

  return (
    <>
      <div className="relative">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setDescriptionModal(true)}>
              <Info className="mr-2 h-4 w-4" />
              View Description
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {descriptionModal && (
          <WatchlistActionDescription
            row={data}
            open={descriptionModal}
            onChange={setDescriptionModal}
          />
        )}
      </div>
    </>
  );
}
