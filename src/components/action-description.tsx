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
    <Dialog modal open={open} onOpenChange={() => onChange(!open)}>
      <DialogContent className="h-screen max-h-[90dvh] sm:h-auto">
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle>
            {row.title}

            {row.rating ? (
              <Badge className="ml-2 text-xs" variant="secondary">{`${Number(
                row.rating,
              ).toFixed(1)} / 10`}</Badge>
            ) : (
              <Badge className="ml-2 text-xs" variant="secondary">
                N/A
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription asChild>
            {row.date && (
              <Badge variant="outline" className="w-fit">
                {new Date(row.date).toLocaleDateString()}
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="my-4 w-full">
          <div className="flex flex-col items-center justify-center gap-4 align-middle md:flex-row">
            {row.poster && row.posterBlur ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Image
                    unoptimized
                    placeholder="blur"
                    blurDataURL={row.posterBlur}
                    src={`https://image.tmdb.org/t/p/w154${row.poster}`}
                    alt={row.title}
                    width={154}
                    height={231}
                    className="h-36 w-auto cursor-pointer rounded-md transition-all hover:scale-105"
                  />
                </DialogTrigger>
                <DialogContent className="h-[90vh]">
                  <div className="h-[85vh] w-full">
                    <Image
                      placeholder="blur"
                      blurDataURL={row.posterBlur}
                      src={`https://image.tmdb.org/t/p/w780${row.poster}`}
                      alt={row.title}
                      unoptimized
                      width={780}
                      height={1170}
                      className="h-full w-full rounded-md p-6"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <div className="h-20 w-16 rounded-md bg-gray-200" />
            )}
            <div className="m-4 max-w-prose leading-6 tracking-wide">
              {row.description}
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="flex flex-col-reverse gap-4 sm:flex-row sm:gap-0">
          <a
            className={cn(
              buttonVariants({
                variant: "link",
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
                variant: "link",
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
          <Close asChild>
            <Button variant="outline">Close</Button>
          </Close>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
