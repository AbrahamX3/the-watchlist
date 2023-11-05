import { getPlaiceholder } from "plaiceholder";
import { z } from "zod";

import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export type GetIMDB = {
  id: number;
  imdb_id: string;
  wikidata_id: string;
  facebook_id: string;
  instagram_id: string;
  twitter_id: string;
};

export type SeriesResponse = {
  adult: boolean;
  backdrop_path: string;
  created_by: Array<{
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string;
  }>;
  episode_run_time: Array<number>;
  first_air_date: string;
  genres: Array<{
    id: number;
    name: string;
  }>;
  homepage: string;
  id: number;
  in_production: boolean;
  languages: Array<string>;
  last_air_date: string;
  last_episode_to_air: {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    episode_type: string;
    production_code: string;
    runtime: number;
    season_number: number;
    show_id: number;
    still_path: string;
  };
  name: string;
  next_episode_to_air: {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    episode_type: string;
    production_code: string;
    season_number: number;
    show_id: number;
    still_path: string;
  };
  networks: Array<{
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }>;
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: Array<string>;
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: Array<{
    id: number;
    logo_path?: string;
    name: string;
    origin_country: string;
  }>;
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  seasons: Array<{
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
    vote_average: number;
  }>;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
};

export type MovieResponse = {
  adult: boolean;
  backdrop_path: string;
  budget: number;
  genres: Array<{
    id: number;
    name: string;
  }>;
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: Array<{
    id: number;
    logo_path?: string;
    name: string;
    origin_country: string;
  }>;
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${env.TMDB_API_KEY}`,
  },
};

async function getIMDbId(
  tmdbId: number,
  type: "MOVIE" | "SERIES",
): Promise<string> {
  const movie_url = `https://api.themoviedb.org/3/movie/${tmdbId}/external_ids`;
  const series_url = `https://api.themoviedb.org/3/tv/${tmdbId}/external_ids`;

  const response = await fetch(
    type === "MOVIE" ? movie_url : series_url,
    options,
  );
  const data = (await response.json()) as GetIMDB;

  if (!data.imdb_id) {
    return "";
  }

  return data.imdb_id;
}

async function fetchBase64(path: string) {
  const buffer = await fetch(path).then(async (res) =>
    Buffer.from(await res.arrayBuffer()),
  );

  const { base64 } = await getPlaiceholder(buffer);

  return base64;
}

async function getTMDBMovieDetails({
  tmdbId,
}: {
  tmdbId: number;
}): Promise<MovieResponse> {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${tmdbId}?language=en-US`,
    options,
  );
  return (await response.json()) as MovieResponse;
}

async function getTMDBSeriesDetails({
  tmdbId,
}: {
  tmdbId: number;
}): Promise<SeriesResponse> {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${tmdbId}?language=en-US`,
    options,
  );

  return (await response.json()) as SeriesResponse;
}

export const watchlistRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.watchlist.findMany({
      orderBy: [
        {
          date: "desc",
        },
        {
          title: "desc",
        },
      ],
    });
  }),
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        type: z.enum(["MOVIE", "SERIES"]),
        date: z.date(),
        tmdbId: z.number(),
        description: z.string(),
        status: z.enum([
          "UPCOMING",
          "PENDING",
          "WATCHING",
          "UNFINISHED",
          "FINISHED",
        ]),
        poster: z.string(),
        rating: z.number(),
        genres: z.array(z.number()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.watchlist.create({
        data: {
          imdbId: await getIMDbId(input.tmdbId, input.type),
          genres: input.genres,
          rating: input.rating,
          poster: input.poster,
          description: input.description,
          title: input.title,
          type: input.type,
          date: input.date,
          tmdbId: input.tmdbId,
          status: input.status,
        },
      });
    }),
  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum([
          "UPCOMING",
          "PENDING",
          "WATCHING",
          "UNFINISHED",
          "FINISHED",
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.watchlist.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        tmdbId: z.number(),
        type: z.enum(["MOVIE", "SERIES"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.type === "MOVIE") {
        const updated = await getTMDBMovieDetails({
          tmdbId: input.tmdbId,
        });

        const posterBlur = await fetchBase64(
          `https://image.tmdb.org/t/p/original${updated.poster_path}`,
        );

        await ctx.db.watchlist.update({
          where: {
            id: input.id,
          },
          data: {
            title: updated.title,
            poster: updated.poster_path,
            posterBlur: posterBlur,
            date: new Date(updated.release_date),
            rating: updated.vote_average,
            description: updated.overview,
            genres: updated.genres.map(
              (genre: { id: number; name: string }) => genre.id,
            ),
          },
        });
      } else if (input.type === "SERIES") {
        const updated = await getTMDBSeriesDetails({
          tmdbId: input.tmdbId,
        });

        const posterBlur = await fetchBase64(
          `https://image.tmdb.org/t/p/original${updated.poster_path}`,
        );

        await ctx.db.watchlist.update({
          where: {
            id: input.id,
          },
          data: {
            title: updated.name,
            poster: updated.poster_path,
            posterBlur: posterBlur,
            date: new Date(updated.first_air_date),
            rating: updated.vote_average,
            description: updated.overview,
            genres: updated.genres.map(
              (genre: { id: number; name: string }) => genre.id,
            ),
          },
        });
      } else {
        return;
      }
    }),
  updater: publicProcedure.mutation(async ({ ctx }) => {
    const toUpdate = await ctx.db.watchlist.findMany({
      where: {
        posterBlur: null,
      },
      take: 25,
    });

    console.log(toUpdate);

    toUpdate.map(async (update) => {
      if (update.type === "MOVIE") {
        const updated = await getTMDBMovieDetails({
          tmdbId: update.tmdbId,
        });

        const posterBlur = await fetchBase64(
          `https://image.tmdb.org/t/p/original${updated.poster_path}`,
        );

        await ctx.db.watchlist.update({
          where: {
            id: update.id,
          },
          data: {
            title: updated.title,
            poster: updated.poster_path,
            posterBlur: posterBlur,
            date: new Date(updated.release_date),
            rating: updated.vote_average,
            description: updated.overview,
            genres: updated.genres.map(
              (genre: { id: number; name: string }) => genre.id,
            ),
          },
        });
      } else if (update.type === "SERIES") {
        const updated = await getTMDBSeriesDetails({
          tmdbId: update.tmdbId,
        });

        const posterBlur = await fetchBase64(
          `https://image.tmdb.org/t/p/original${updated.poster_path}`,
        );

        await ctx.db.watchlist.update({
          where: {
            id: update.id,
          },
          data: {
            title: updated.name,
            poster: updated.poster_path,
            posterBlur: posterBlur,
            date: new Date(updated.first_air_date),
            rating: updated.vote_average,
            description: updated.overview,
            genres: updated.genres.map(
              (genre: { id: number; name: string }) => genre.id,
            ),
          },
        });
      } else {
        return;
      }
    });
  }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.watchlist.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
