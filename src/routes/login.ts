import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { FastifyInstance } from "fastify";
import { BadRequest } from "./_errors/bad-request";

export async function login(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/login",
    {
      schema: {
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (req, reply) => {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new BadRequest("Invalid Credentials.");
      }

      const passwordMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatch) {
        reply.status(401).send({ error: "Invalid credentials" });
        return;
      }

      const token = jwt.sign({ userId: user.id }, "your_secret_key", {
        expiresIn: "1h",
      });

      return reply.status(201).send({ token });
    }
  );
}
