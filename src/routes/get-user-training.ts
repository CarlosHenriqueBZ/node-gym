import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function getUserTrainings(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/users/:userId/trainings",
    {
      schema: {
        params: z.object({
          userId: z.string(),
        }),
        response: {
          /* 200: z.object({
            training: z.object({
              name: z.string(),
              type: z.string(),
              calories: z.number().int().nullable(),
              slug: z.string(),
              duration: z.number().int().nullable(),
              exercises: z.array(
                z.object({
                  name: z.string().min(4),
                  reps: z.number().int().positive().nullable(),
                  calories: z.number().int().positive().nullable(),
                  videoUrl: z.string().min(4),
                })
              ),
            }),
          }), */
        },
      },
    },
    async (req, reply) => {
      const { userId } = req.params;
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });
      const userTrainings = await prisma.userTraining.findMany({
        where: { userId: parseInt(userId) },
        include: { training: true },
      });

      const trainings = userTrainings.map(
        (userTraining) => userTraining.training
      );

      if (!user) {
        throw new BadRequest("User not found.");
      }

      return reply.send({ trainings });
    }
  );
}
