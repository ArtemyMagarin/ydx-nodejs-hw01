import Fastify from "fastify";
import app from "./app.js";

const PORT = process.env.PORT || 8080;
const fastify = Fastify({ logger: true });

app(fastify)
  .listen(8080)
  .then(() => console.log(`Started server on port ${PORT}`))
  .catch((err) => {
    fastify.log.error(err);
    process.exit(1);
  });
