import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { meetingsRouter } from "~/server/api/routers/meetings";
import { membersRouter } from "~/server/api/routers/members";


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  meetings: meetingsRouter,
  members: membersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
