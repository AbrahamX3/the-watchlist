"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Close } from "@radix-ui/react-dialog";
import { Loader2, Plus, SearchIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Badge } from "~/components/ui/badge";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { statusOptions } from "~/lib/options";
import { cn } from "~/lib/utils";
import { type MultiSearch, type SearchResult } from "~/server/api/routers/tmdb";
import { api } from "~/trpc/react";

const formSchema = z.object({
  titleId: z.string(),
  status: z.enum(["UPCOMING", "PENDING", "WATCHING", "UNFINISHED", "FINISHED"]),
});

export default function WatchlistActionCreate() {
  const utils = api.useUtils();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titleId: "",
      status: "WATCHING",
    },
  });

  const [searchTitle, setSearchTitle] = useState("");
  const [titleList, setTitleList] = useState<MultiSearch["results"]>([]);
  const [selectedTitle, setSelectedTitle] = useState<SearchResult | null>(null);
  const [isOpen, setOpen] = useState(false);

  const search = api.tmdb.search.useMutation({
    onSuccess: (data) => {
      setSelectedTitle(null);
      setSearchTitle("");
      form.setValue("titleId", "");
      toast.success(data?.results.length + " results found");
      setTitleList(data?.results ?? []);
    },
    onError: (error) => {
      toast.error(error.message, {
        description: error.shape?.message,
      });
    },
  });

  const watchlist = api.watchlist.create.useMutation({
    onSuccess: async () => {
      await utils.watchlist.invalidate();
      basicReset();
      setOpen(false);
      router.refresh();
      toast.success("Added to Watchlist");
    },
    onError: (error) => {
      toast.error(error.message, {
        description: error.shape?.message,
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    let title = "";
    let release = "";

    if (!selectedTitle) {
      return;
    }

    if (selectedTitle.media_type === "tv") {
      title = selectedTitle.name ?? "";
      release = selectedTitle.first_air_date ?? "";
    } else if (selectedTitle.media_type === "movie") {
      title = selectedTitle.title ?? "";
      release = selectedTitle.release_date ?? "";
    }

    watchlist.mutate({
      type: selectedTitle.media_type === "tv" ? "SERIES" : "MOVIE",
      title: title,
      status: values.status,
      date: new Date(release),
      description: selectedTitle.overview,
      genres: selectedTitle.genre_ids ?? [],
      poster: selectedTitle.poster_path ?? "",
      rating: selectedTitle.vote_average ?? 0,
      tmdbId: selectedTitle.id,
    });
  }

  useEffect(() => {
    const subscription = form.watch(({ titleId }) => {
      if (titleId) {
        const selected = titleList.find((item) => item.id === Number(titleId));

        if (selected) {
          setSelectedTitle(selected);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, titleList]);

  function basicReset() {
    form.reset();
    setSelectedTitle(null);
    setTitleList([]);
    setSearchTitle("");
  }

  return (
    <Dialog
      modal
      open={isOpen}
      onOpenChange={() => {
        setOpen(!isOpen);
        basicReset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          Add to Watchlist <Plus className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-lg sm:max-w-2xl md:max-w-2xl lg:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Add to Watchlist</DialogTitle>
          <DialogDescription>
            Add a movie or series to your watchlist.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex w-full flex-col items-center gap-4 align-middle">
              <div className="flex w-full items-center justify-center gap-4">
                <div className="flex w-1/2 flex-col gap-4 align-middle">
                  <Label htmlFor="search">Search</Label>
                  <Input
                    id="search"
                    autoComplete="off"
                    type="search"
                    placeholder="Search for a title..."
                    value={searchTitle}
                    disabled={search.isLoading}
                    onChange={(e) => setSearchTitle(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-4 align-middle">
                  <div className="pt-4" />
                  <Button
                    type="button"
                    variant="outline"
                    className="bottom-0 col-span-1"
                    disabled={search.isLoading}
                    onClick={() => {
                      if (searchTitle) {
                        search.mutate({
                          title: searchTitle,
                        });
                      }
                    }}
                  >
                    <span>Search</span>
                    {search.isLoading ? (
                      <Loader2 className="ml-4 h-4 w-4 animate-spin" />
                    ) : (
                      <SearchIcon className="ml-4 h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              {titleList.length > 0 && (
                <FormField
                  control={form.control}
                  name="titleId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        {selectedTitle?.id
                          ? `Title: ${selectedTitle.id}`
                          : "Title"}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full truncate">
                            <SelectValue placeholder="Select a title..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <ScrollArea className={`h-40 w-full`}>
                            {titleList.length > 0 ? (
                              titleList.map((item) => {
                                if (item.media_type === "movie") {
                                  return (
                                    <SelectItem
                                      key={item.id}
                                      value={item.id.toString()}
                                    >
                                      <div className="flex w-full items-center justify-between gap-4 align-middle">
                                        {item.poster_path && item.title ? (
                                          <Image
                                            src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                                            alt={item.title}
                                            width={15}
                                            height={50}
                                            style={{
                                              width: "auto",
                                              height: "auto",
                                            }}
                                            className="rounded-md"
                                          />
                                        ) : (
                                          <div className="h-[30px] w-[15px] bg-gray-200" />
                                        )}
                                        <span
                                          className="min-w-[300px] max-w-[200px] overflow-hidden truncate text-ellipsis whitespace-nowrap"
                                          title={item.title}
                                        >
                                          {item.title}
                                        </span>
                                        {item.vote_average ? (
                                          <span className="w-[30px] justify-self-end text-right">
                                            {item.vote_average.toFixed(1)}
                                          </span>
                                        ) : (
                                          <span className="w-[30px] justify-self-end text-right">
                                            0.0
                                          </span>
                                        )}
                                      </div>
                                    </SelectItem>
                                  );
                                }

                                if (item.media_type === "tv") {
                                  return (
                                    <SelectItem
                                      key={item.id}
                                      value={item.id.toString()}
                                    >
                                      <div className="flex w-full items-center justify-between gap-4 align-middle">
                                        {item.poster_path && item.name ? (
                                          <Image
                                            src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                                            alt={item.name}
                                            width={15}
                                            height={50}
                                            style={{
                                              width: "auto",
                                              height: "auto",
                                            }}
                                            className="rounded-md"
                                          />
                                        ) : (
                                          <div className="h-[30px] w-[15px] bg-gray-200" />
                                        )}
                                        <span
                                          className="min-w-[300px] max-w-[200px] overflow-hidden truncate text-ellipsis whitespace-nowrap"
                                          title={item.name}
                                        >
                                          {item.name}
                                        </span>
                                        {item.vote_average ? (
                                          <span className="w-[30px] justify-self-end text-right">
                                            {item.vote_average.toFixed(1)}
                                          </span>
                                        ) : (
                                          <span className="w-[30px] justify-self-end text-right">
                                            0.0
                                          </span>
                                        )}
                                      </div>
                                    </SelectItem>
                                  );
                                }
                              })
                            ) : (
                              <SelectItem value="null" disabled>
                                <span className="truncate">No results</span>
                              </SelectItem>
                            )}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {selectedTitle && (
                <Card className="col-span-3 w-full p-4">
                  <CardTitle className="flex flex-wrap gap-2 text-lg">
                    {selectedTitle.title ?? selectedTitle.name}
                    <span>(#{selectedTitle.id})</span>
                    <a
                      className={cn(
                        buttonVariants({
                          variant: "link",
                          size: "sm",
                        }),
                      )}
                      target="_blank"
                      rel="noreferrer"
                      href={
                        selectedTitle.media_type === "movie"
                          ? `https://www.themoviedb.org/movie/${selectedTitle.id}`
                          : `https://www.themoviedb.org/tv/${selectedTitle.id}`
                      }
                    >
                      <span>View on TMDB</span>
                    </a>
                  </CardTitle>
                  <CardDescription className="mt-2 flex gap-2 text-base">
                    {selectedTitle.vote_average ? (
                      <Badge className="text-xs" variant="secondary">{`${Number(
                        selectedTitle.vote_average,
                      ).toFixed(1)} / 10`}</Badge>
                    ) : (
                      ""
                    )}
                    {selectedTitle.first_air_date ? (
                      <Badge variant="outline">
                        {new Date(
                          selectedTitle.first_air_date,
                        ).toLocaleDateString()}
                      </Badge>
                    ) : selectedTitle.release_date ? (
                      <Badge variant="outline">
                        {new Date(
                          selectedTitle.release_date,
                        ).toLocaleDateString()}
                      </Badge>
                    ) : (
                      ""
                    )}
                    {selectedTitle.media_type === "movie" ? (
                      <Badge>Movie</Badge>
                    ) : (
                      <Badge>Series</Badge>
                    )}
                  </CardDescription>
                  <CardContent className="p-0 pt-4">
                    <ScrollArea className="my-4 h-40 w-full">
                      <p className="flex flex-col items-center justify-center gap-4 md:flex-row">
                        {selectedTitle.poster_path && selectedTitle.title ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Image
                                unoptimized
                                loading="eager"
                                src={`https://image.tmdb.org/t/p/w200${selectedTitle.poster_path}`}
                                alt={selectedTitle.title}
                                width={80}
                                height={120}
                                className="cursor-pointer rounded-md transition-all hover:scale-105"
                              />
                            </DialogTrigger>
                            <DialogContent className="h-screen max-h-[90dvh] w-full">
                              <Image
                                src={`https://image.tmdb.org/t/p/original${selectedTitle.poster_path}`}
                                alt={selectedTitle.title}
                                unoptimized
                                loading="eager"
                                fill
                                className="rounded-md object-contain p-6"
                              />
                            </DialogContent>
                          </Dialog>
                        ) : selectedTitle.poster_path && selectedTitle.name ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Image
                                unoptimized
                                loading="eager"
                                src={`https://image.tmdb.org/t/p/w200${selectedTitle.poster_path}`}
                                alt={selectedTitle.name}
                                width={80}
                                height={120}
                                className="cursor-pointer rounded-md transition-all hover:scale-105"
                              />
                            </DialogTrigger>
                            <DialogContent className="h-screen max-h-[90dvh] w-full">
                              <Image
                                src={`https://image.tmdb.org/t/p/original${selectedTitle.poster_path}`}
                                alt={selectedTitle.name}
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
                          {selectedTitle.overview}
                        </p>
                      </p>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="p-0">
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
                                <SelectValue placeholder="Select the status..." />
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
                  </CardFooter>
                </Card>
              )}
            </div>
            {selectedTitle && (
              <DialogFooter className="flex flex-col-reverse gap-4 sm:flex-row sm:gap-0">
                <Close asChild>
                  <Button variant="outline">Close</Button>
                </Close>
                <Button type="submit">Add to Watchlist</Button>
              </DialogFooter>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
