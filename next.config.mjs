import withPlaiceholder from "@plaiceholder/next";

await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        hostname: "image.tmdb.org",
      },
    ],
  },
  experimental: {
    reactCompiler: {
      compilationMode: "annotation",
    },
  },
};

// @ts-expect-error -- this is a valid config
export default withPlaiceholder(config);
