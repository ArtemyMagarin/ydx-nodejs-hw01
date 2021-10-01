import imageCreate from "./imageCreate.js";
import imageDelete from "./imageDelete.js";
import imageList from "./imageList.js";
import imageRead from "./imageRead.js";
import merge from "./merge.js";

export default function routes(fastify, options, done) {
  fastify.post("/upload", imageCreate);
  fastify.get("/image/:id", imageRead);
  fastify.delete("/image/:id", imageDelete);
  fastify.get("/list", imageList);
  fastify.get("/merge", merge);
  fastify.get("/", (req, reply) => {
    reply.header("Content-Type", "text/html; charset=utf-8")
      .send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <form action="http://127.0.0.1:8080/upload" method="POST" enctype="multipart/form-data">
            <input type="file" name="image">
            <button>send</button>
        </form>
    </body>
    </html>`);
  });
  done();
}
