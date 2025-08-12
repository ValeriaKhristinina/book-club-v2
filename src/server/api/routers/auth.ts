import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "../../../env.mjs";
import { z } from "zod";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(({ input }) => {
      const USERNAME = env.NEXT_PUBLIC_LOGIN_USER;
      const PASSWORD = env.NEXT_PUBLIC_LOGIN_PASSWORD;

      if (USERNAME === input.email && PASSWORD === input.password) {
        return true;
      } else {
        throw new Error("Something went wrong");
      }
    })
});
