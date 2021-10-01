import fastifyMultipart from "fastify-multipart";

import routes from "./routes/index.js";

function app(fastify) {
  fastify.register(fastifyMultipart);
  fastify.register(routes);
  return fastify;
}

export default app;
