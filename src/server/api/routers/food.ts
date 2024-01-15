import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// NOTE: As mentioned in my writeup, I feel like this would be better suited to be in the frontend.
const cleanSearchInput = (searchStr: string) => {
  const creators: string[] = [];
  const tags: string[] = [];
  const query: string[] = [];

  const wordsInSearch = searchStr.split(" ");

  wordsInSearch.map((word) => {
    if (!word.length) return;

    if (word.charAt(0) === "@") {
      creators.push(word.substring(1));
      return;
    }

    if (word.charAt(0) === "#") {
      tags.push(word.substring(1));
      return;
    }

    query.push(word);
    return;
  });

  return { creators, tags, query };
};

export const foodRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ searchStr: z.string() }))
    .query(async ({ ctx, input }) => {
      const { creators, tags, query } = cleanSearchInput(input.searchStr);

      const food = await ctx.db.food.findMany({
        where: {
          Tags: tags.length ? { some: { title: { in: tags } } } : undefined,
          // Note: As mentioned in `seed.ts`, this will not work for a system that allows spaces in usernames.
          creator: creators.length ? { in: creators } : undefined,
          // NOTE: As mentioned in my writeup, I am sure there is a way to handle this more efficiently, but that might require a raw query.
          OR: query.length
            ? [
                {
                  AND: query.map((word) => ({
                    name: {
                      contains: word,
                      mode: "insensitive",
                    },
                  })),
                },
                {
                  AND: query.map((word) => ({
                    description: {
                      contains: word,
                      mode: "insensitive",
                    },
                  })),
                },
              ]
            : undefined,
        },
      });

      return food;
    }),
});
