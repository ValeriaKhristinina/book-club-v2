import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import dayjs from 'dayjs';

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
  getClosedMeetings: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.meeting.findMany({
      where: {
        isComplete: true
      },
      include: {
        participants: {
          include: {
            participant: true
          }
        }, 
        chosenBy: true
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
        chosenById: z.number().optional(),
        participants: z.array(
          z.object({
            id: z.number(),
            rating: z.union([z.number(), z.null()]),
            isVisited: z.boolean()
          })
        ),
        isComplete: z.boolean()
      })
    )
    .mutation(({ input, ctx }) => {
      const baseDataRequest = {
        date: input.date,
        title: input.title,
        author: input.author,
        cover: input.cover,
        chosenById: input.chosenById ? input.chosenById : null,
        isComplete: input.isComplete,
        participants: {
          create: input.participants.map((participant) => {
            return {
              rating: participant.rating,
              isVisited: participant.isVisited,
              participant: {
                connect: {
                  id: participant.id
                }
              }
            };
          })
        }
      };
      if (input.chosenById) {
        baseDataRequest.chosenById = input.chosenById;
      }
      return ctx.prisma.meeting.create({
        data: baseDataRequest
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
    .mutation(({ input, ctx }) => {
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
    }),
  getNextMeetings: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.meeting.findMany({
      where: {
        isComplete: false
      }
    });
  }),

  getNextMeeting: publicProcedure.query(async ({ ctx }) => {
    const meetings = await ctx.prisma.meeting.findMany({
      where: {
        isComplete: false,
        date: {
          gte: dayjs().startOf('day').toDate(),
        }
      },
      orderBy: [
        {
          date: 'asc',
        },
      ],
      include: {
        chosenBy: true
      }
    })

    return meetings?.[0]
  })
});
