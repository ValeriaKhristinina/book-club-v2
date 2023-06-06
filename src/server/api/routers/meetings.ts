import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const meetingsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.meeting.findMany({
      include: {
        participants: {
          include: {
            participant: true
          }
        }
      }
    });
  }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.meeting.findUnique({
        where: {
          id: input.id
        },
        include: {
          participants: true
        }
      });
    }),
  create: publicProcedure
    .input(
      z.object({
        date: z.date(),
        title: z.string(),
        author: z.string(),
        cover: z.string().optional(),
        chosenById: z.number(),
        participants: z.array(
          z.object({
            id: z.number(),
            created_at: z.date(),
            firstName: z.string(),
            lastName: z.string(),
            joinDate: z.date(),
            exitDate: z.date().optional()
          })
        ),
        isComplete: z.boolean()
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.meeting.create({
        data: {
          date: input.date,
          title: input.title,
          author: input.author,
          cover: input.cover,
          chosenById: input.chosenById,
          participants: {
            createMany: {
              data: input.participants
            }
          },
          isComplete: input.isComplete
        },
        include: {
          participants: true
        }
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        date: z.date().optional(),
        title: z.string().optional(),
        author: z.string().optional(),
        cover: z.string().optional(),
        chosenById: z.number().optional(),
        participants: z
          .array(
            z.object({
              id: z.number().optional(),
              created_at: z.date().optional(),
              firstName: z.string().optional(),
              lastName: z.string().optional(),
              joinDate: z.date().optional(),
              exitDate: z.date().optional()
            })
          )
          .optional(),
        isComplete: z.boolean().optional()
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.meeting.update({
        where: {
          id: input.id
        },
        data: {
          date: input.date,
          title: input.title,
          author: input.author,
          cover: input.cover,
          chosenById: input.chosenById,
          participants: {
            upsert: input.participants?.map((participant) => ({
              where: { id: participant.id },
              create: participant,
              update: participant
            }))
          },
          isComplete: input.isComplete
        },
        include: {
          participants: true
        }
      });
    })
});
