import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Close } from "@radix-ui/react-dialog";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { statusOptions } from "~/lib/options";
import { api } from "~/trpc/react";

const formSchema = z.object({
  status: z.enum(["UPCOMING", "PENDING", "WATCHING", "UNFINISHED", "FINISHED"]),
});

export default function WatchlistActionUpdateStatus({
  id,
  status,
  open,
  onChange,
}: {
  id: string;
  status: "UPCOMING" | "PENDING" | "WATCHING" | "UNFINISHED" | "FINISHED";
  open: boolean;
  onChange: (open: boolean) => void;
}) {
  const utils = api.useContext();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: status,
    },
  });

  const updateStatus = api.watchlist.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.watchlist.invalidate();
      router.refresh();
      toast.success("Updated Status");
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message, {
        description: error.shape?.message,
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateStatus.mutate({
      id,
      status: values.status,
    });
  }

  return (
    <Dialog modal open={open} onOpenChange={() => onChange(!open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Status</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full truncate">
                        <SelectValue placeholder="Select status..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectSeparator />
                      <ScrollArea className="h-40 w-full">
                        {statusOptions.map((item) => (
                          <SelectItem
                            key={item.value}
                            title={item.label}
                            value={item.value}
                          >
                            <div className="flex items-center gap-2 align-middle">
                              <item.icon className="h-3 w-3" />
                              <span>{item.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex flex-col-reverse gap-4 sm:flex-row sm:gap-0">
              <Close asChild>
                <Button variant="outline">Close</Button>
              </Close>
              <Button type="submit">Update New Status</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
