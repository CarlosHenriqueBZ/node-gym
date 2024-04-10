import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function getTraining(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/training/:trainingId",
    {
      schema: {
        params: z.object({
          trainingId: z.string().uuid(),
        }),
        response: {
          200: z.object({
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
          }),
        },
      },
    },
    async (req, reply) => {
      const { trainingId } = req.params;
      const training = await prisma.training.findUnique({
        select: {
          name: true,
          type: true,
          calories: true,
          slug: true,
          duration: true,
          exercises: true,
        },
        where: {
          id: trainingId,
        },
      });

      if (!training) {
        throw new BadRequest("Event not found.");
      }

      return reply.send({
        training: {
          name: training.name,
          type: training.type,
          calories: training.calories,
          slug: training.slug,
          duration: training.duration,
          exercises: training.exercises,
        },
      });
    }
  );
}
