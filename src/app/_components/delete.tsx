import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { api } from "~/trpc/react";

export default function WatchlistActionDelete({
  id,
  open,
  onChange,
}: {
  id: string;
  open: boolean;
  onChange: (open: boolean) => void;
}) {
  const utils = api.useContext();
  const router = useRouter();

  const { mutate, isLoading } = api.watchlist.delete.useMutation({
    onSuccess: async () => {
      await utils.watchlist.invalidate();
      router.refresh();
      toast.success("Deleted from Watchlist");
    },
    onError: (error) => {
      toast.error(error.message, {
        description: error.shape?.message,
      });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={() => onChange(!open)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¡Warning!</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Are you sure you want to delete this item?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() =>
              mutate({
                id,
              })
            }
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
