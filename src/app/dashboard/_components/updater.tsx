"use client";

import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export default function Updater() {
  const updater = api.watchlist.updater.useMutation({
    onSuccess: () => {
      toast.success("Updated");
    },
    onError: (error) => {
      toast.error(error.message, {
        description: error.shape?.message,
      });
    },
  });

  return (
    <Button variant="outline" onClick={() => updater.mutate()}>
      Update
    </Button>
  );
}
