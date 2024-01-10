import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const foodRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ searchStr: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      // TODO: implement
      const allFood = await ctx.db.food.findMany({});
      return allFood;
    }),
});
