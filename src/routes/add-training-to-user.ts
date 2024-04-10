import { PrismaClient } from "@prisma/client";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { generateSlug } from "../utils/generate-slug";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { BadRequest } from "./_errors/bad-request";

export async function addTrainingToUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/training/:trainingId/add/:userId",
    {
      schema: {
        params: z.object({
          userId: z.string(), // Assuming userId is a UUID
          trainingId: z.string().uuid(), // Assuming trainingId is a UUID
        }),
        response: {
          201: z.object({
            trainingId: z.string().uuid(),
          }),
        },
      },
    },
    async (req, reply) => {
      const { name, calories, duration, exercises, type } = req.body;
      const { userId, trainingId } = req.params;

      const existingUserTraining = await prisma.userTraining.findFirst({
        where: {
            userId: parseInt(userId),
            trainingId: trainingId
        }
    });

    if (existingUserTraining) {
        reply.status(400).send({ error: 'Training already associated with user' });
        return;
    }

    const userTraining = await prisma.userTraining.create({
        data: {
            userId: parseInt(userId),
            trainingId: trainingId
        }
    });
      return  reply.status(201).send({ trainingId: userTraining.trainingId });
    }
  );
}
