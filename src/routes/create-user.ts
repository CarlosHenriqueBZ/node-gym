import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import { BadRequest } from "./_errors/bad-request";

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/user",
    {
      schema: {
        body: z.object({
          name: z.string().min(4),
          identity: z.string().min(11).max(11),
          email: z.string().email(),
          password: z.string().min(8).max(32),
        }),
        response: {},
      },
    },
    async (req, reply) => {
      const { name, email, password, identity } = req.body;

      const userWithSameEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (userWithSameEmail) {
        throw new BadRequest("E-mail already registered!");
      }

      const userWithSameCPF = await prisma.user.findUnique({
        where: { identity },
      });
      if (userWithSameCPF) {
        throw new BadRequest("CPF already registered!");
      }

      // Hash da senha
      const passwordHash = await bcrypt.hash(password, 10);

      // Criação do usuário
      const user = await prisma.user.create({
        data: {
          name,
          identity,
          email,
          passwordHash,
        },
      });

      return reply.status(201).send({ userId: user.id });
    }
  );
}
