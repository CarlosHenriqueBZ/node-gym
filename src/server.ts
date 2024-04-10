import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

import { fastifyCors } from "@fastify/cors";
import { createTraining } from "./routes/create-training";
import { errorHandler } from "./erros-handler";
import { getTraining } from "./routes/get-training";
import { createUser } from "./routes/create-user";
import { addTrainingToUser } from "./routes/add-training-to-user";
import { getUserTrainings } from "./routes/get-user-training";
export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createUser)
app.register(createTraining)


app.register(getTraining)
app.register(getUserTrainings)
app.register(addTrainingToUser)

app.setErrorHandler(errorHandler)

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log("running HTTP Server");
});
