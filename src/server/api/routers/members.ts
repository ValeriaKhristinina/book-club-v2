import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const membersRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.member.findMany({
      include: {
        meetings: true,
        chosenMeetings: true,
      },
    });
  }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.member.findUnique({
        where: {
          id: input.id,
        },
        include: {
          meetings: true,
          chosenMeetings: true,
        },
      });
    }),
  create: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        joinDate: z.date(),
        exitDate: z.date().optional(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.member.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          joinDate: input.joinDate,
          exitDate: input.exitDate,
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        joinDate: z.date().optional(),
        exitDate: z.date().optional(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.member.update({
        where: {
          id: input.id,
        },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          joinDate: input.joinDate,
          exitDate: input.exitDate,
        },
      });
    }),
});

