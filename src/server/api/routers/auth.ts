import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "../../../env.mjs";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(({ input }) => {
      // fallback if env vars are missing
      const USERNAME = env.LOGIN_USER;
      const PASSWORD = env.LOGIN_PASSWORD;

      console.log("LOGIN USER:", USERNAME);
      console.log("LOGIN PASSWORD:", PASSWORD);

      if (USERNAME === input.email && PASSWORD === input.password) {
        return { success: true };
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials"
        });
      }
    })
});
