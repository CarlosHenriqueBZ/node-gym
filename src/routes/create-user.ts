import { PrismaClient } from "@prisma/client";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { generateSlug } from "../utils/generate-slug";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import bcrypt from 'bcryptjs';
import { BadRequest } from "./_errors/bad-request";

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/user",
    {
      schema: {
        body: z.object({
          name: z.string().min(4),
          email: z.string().email(),
          password:z.string().min(8).max(32)
        }),
        response: {
          
        },
      },
    },
    async (req, reply) => {
        const { name, email, password } = req.body;
  
        const userWithSameEmail = await prisma.user.findUnique({
          where: {
            email,
          },
        });
  
        if (userWithSameEmail !== null) {
          throw new BadRequest("E-mail already registered!");
        }
  
        const passwordHash = await bcrypt.hash(password, 10);
  
        const user = await prisma.user.create({
          data: {
            name,
            email,
            passwordHash,
          },
        });
  
        return reply.status(201).send({ userId: user.id });
      }
  );
}