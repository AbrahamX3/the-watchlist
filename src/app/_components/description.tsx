import { Close } from "@radix-ui/react-dialog";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { type WatchlistColumn } from "./columns";

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
      <DialogContent className="h-screen sm:h-auto sm:max-h-[97vh]">
        <DialogHeader>
          <DialogTitle>
            {row.title}
            {row.rating ? (
              <span>{` - ${Number(row.rating).toFixed(1)}`}</span>
            ) : (
              ""
            )}
          </DialogTitle>
          <DialogDescription>
            {row.year ? (
              <span className="text-muted">
                {` (${new Date(row.year).toLocaleDateString()})`}
              </span>
            ) : (
              ""
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="w-full">
          <p>{row.description}</p>
        </div>
        <DialogFooter>
          <Close asChild>
            <Button variant="outline">Close</Button>
          </Close>
          <Button>
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://www.imdb.com/title/${row.imdbId}`}
            >
              <span>View on IMDb</span>
            </a>
          </Button>
          <Button>
            <a
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
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
