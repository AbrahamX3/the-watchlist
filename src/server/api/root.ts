import { tmdbRouter } from "~/server/api/routers/tmdb";
import { watchlistRouter } from "~/server/api/routers/watchlist";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  watchlist: watchlistRouter,
  tmdb: tmdbRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
