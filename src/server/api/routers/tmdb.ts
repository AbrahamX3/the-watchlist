import { z } from "zod";

import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export interface SearchResult {
  adult: boolean;
  backdrop_path?: string;
  id: number;
  name?: string;
  original_language?: string;
  original_name?: string;
  overview: string;
  poster_path?: string;
  media_type: "movie" | "tv";
  genre_ids?: Array<number>;
  popularity: number;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  origin_country?: Array<string>;
  gender?: number;
  known_for_department?: string;
  profile_path?: string;
  known_for?: Array<{
    adult: boolean;
    backdrop_path?: string;
    id: number;
    name?: string;
    original_language: string;
    original_name?: string;
    overview: string;
    poster_path?: string;
    media_type: string;
    genre_ids: Array<number>;
    popularity: number;
    first_air_date?: string;
    vote_average: number;
    vote_count: number;
    origin_country?: Array<string>;
    title?: string;
    original_title?: string;
    release_date?: string;
    video?: boolean;
  }>;
  title?: string;
  original_title?: string;
  release_date?: string;
  video?: boolean;
}

export interface MultiSearch {
  page: number;
  results: SearchResult[];
  total_pages: number;
  total_results: number;
}

export const tmdbRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.watchlist.findMany();
  }),
  search: publicProcedure
    .input(
      z.object({
        title: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const url = `https://api.themoviedb.org/3/search/multi?query=${input.title}`;
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${env.TMDB_API_KEY}`,
          },
        };

        const response = await fetch(url, options);
        const data = (await response.json()) as MultiSearch;

        return data;
      } catch (error) {
        console.error(error);
      }
    }),
});
