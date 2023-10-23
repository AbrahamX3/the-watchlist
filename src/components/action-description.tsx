import Image from "next/image";
import { type Prisma } from "@prisma/client";
import { Close } from "@radix-ui/react-dialog";

import { Button, buttonVariants } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

type WatchlistColumn = Prisma.WatchlistGetPayload<object>;

export default function WatchlistActionDescription({
  open,
  onChange,
  row,
}: {
  open: boolean;
  onChange: (open: boolean) => void;
  row: WatchlistColumn;
}) {
  return (
    <Dialog
      modal
      open={open}
      onOpenChange={() => {
        onChange(!open);
      }}
    >
      <DialogContent className="h-screen max-h-[90dvh] sm:h-auto">
        <DialogHeader>
          <DialogTitle>
            {row.title}
            {row.rating ? (
              <Badge className="ml-2 text-xs" variant="secondary">{`${Number(
                row.rating,
              ).toFixed(1)} / 10`}</Badge>
            ) : (
              ""
            )}
          </DialogTitle>
          <DialogDescription>
            {row.year ? (
              <Badge variant="outline">
                {new Date(row.year).toLocaleDateString()}
              </Badge>
            ) : (
              ""
            )}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-40 w-full">
          <div className="flex flex-col items-center justify-center gap-4 align-middle md:flex-row">
            {row.poster ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Image
                    unoptimized
                    loading="eager"
                    src={`https://image.tmdb.org/t/p/w200${row.poster}`}
                    alt={row.title}
                    width={80}
                    height={120}
                    className="cursor-pointer rounded-md transition-all hover:scale-105"
                  />
                </DialogTrigger>
                <DialogContent className="h-screen max-h-[90dvh] w-full">
                  <Image
                    src={`https://image.tmdb.org/t/p/original${row.poster}`}
                    alt={row.title}
                    unoptimized
                    loading="eager"
                    fill
                    className="rounded-md object-contain p-6"
                  />
                </DialogContent>
              </Dialog>
            ) : (
              <div className="h-20 w-16 rounded-md bg-gray-200" />
            )}
            <p className="max-w-prose text-left leading-6 tracking-wide">
              {row.description}
            </p>
          </div>
        </ScrollArea>
        <DialogFooter className="flex flex-col-reverse gap-4 sm:flex-row sm:gap-0">
          <Close asChild>
            <Button variant="outline">Close</Button>
          </Close>
          <a
            className={cn(
              buttonVariants({
                variant: "default",
              }),
            )}
            target="_blank"
            rel="noreferrer"
            href={`https://www.imdb.com/title/${row.imdbId}`}
          >
            <span>View on IMDb</span>
          </a>
          <a
            className={cn(
              buttonVariants({
                variant: "default",
              }),
            )}
            target="_blank"
            rel="noreferrer"
            href={
              row.type === "MOVIE"
                ? `https://www.themoviedb.org/movie/${row.tmdbId}`
                : `https://www.themoviedb.org/tv/${row.tmdbId}`
            }
          >
            <span>View on TMDB</span>
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
