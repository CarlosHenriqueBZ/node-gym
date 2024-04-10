import { PrismaClient } from "@prisma/client";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { generateSlug } from "../utils/generate-slug";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { BadRequest } from "./_errors/bad-request";

export async function createTraining(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/training",
    {
      schema: {
        body: z.object({
          name: z.string().min(4),
          type: z.string().min(4),
          duration: z.number().int().positive().nullable(),
          exercises: z.array(
            z.object({
              name: z.string().min(4),
              reps: z.number().int().positive().nullable(),
              calories: z.number().int().positive().nullable(),
              videoUrl: z.string().min(4),
            })
          ),
        }),
        response: {
          201: z.object({
            trainingId: z.string(),
          }),
        },
      },
    },
    async (req, reply) => {
      const { name, calories, duration, exercises, type } = req.body;

      console.log(req.body);
      const slug = generateSlug(name);
      const trainingWithSameSlug = await prisma.training.findUnique({
        where: {
          slug,
        },
      });

      if (trainingWithSameSlug !== null) {
        throw new BadRequest("Another Training with same title");
      }

      const training = await prisma.training.create({
        data: {
          name,
          type,
          calories,
          slug,
          duration,
          exercises: {
            createMany: {
              data: exercises,
            },
          },
        },
      });
      return reply.status(201).send({ trainingId: training.id });
    }
  );
}