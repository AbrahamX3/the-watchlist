import { useState } from "react";
import { useRouter } from "next/navigation";
import { type Row } from "@tanstack/react-table";
import {
  BookOpenCheck,
  Info,
  MoreHorizontal,
  RefreshCcw,
  Trash,
} from "lucide-react";
import { toast } from "sonner";

import WatchlistActionDescription from "~/components/action-description";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { api } from "~/trpc/react";
import { type WatchlistColumn } from "./columns";
import WatchlistActionDelete from "./delete";
import WatchlistActionUpdateStatus from "./status";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}
export function WatchlistActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const data = row.original as WatchlistColumn;
  const utils = api.useUtils();
  const router = useRouter();
  const [descriptionModal, setDescriptionModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateStatusModal, setUpdateStatusModal] = useState(false);
  const update = api.watchlist.update.useMutation({
    onSuccess: async () => {
      await utils.watchlist.invalidate();
      router.refresh();
      toast.success("Updated");
    },
  });

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
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                update.mutate({
                  id: data.id,
                  type: data.type,
                  tmdbId: data.tmdbId,
                })
              }
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setUpdateStatusModal(true)}>
              <BookOpenCheck className="mr-2 h-4 w-4" />
              Update Status
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteModal(true)}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {deleteModal && (
          <WatchlistActionDelete
            id={data.id}
            onChange={setDeleteModal}
            open={deleteModal}
          />
        )}
        {descriptionModal && (
          <WatchlistActionDescription
            row={data}
            open={descriptionModal}
            onChange={setDescriptionModal}
          />
        )}
        {updateStatusModal && (
          <WatchlistActionUpdateStatus
            id={data.id}
            open={updateStatusModal}
            onChange={setUpdateStatusModal}
            status={data.status}
          />
        )}
      </div>
    </>
  );
}
