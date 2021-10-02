import { retrieveImage } from "../controllers/imageController.js";
import { getFile, picture2filename } from "../utils.js";

async function imageRead(req, reply) {
  const { id } = req.params;
  try {
    const picture = await retrieveImage({ id });
    if (!picture) {
      return reply
        .status(404)
        .send({ message: `Image with id = ${id} is not found` });
    }
    const filename = picture2filename(picture);
    const stream = await getFile(filename);
    if (stream === null) {
      return reply
        .status(404)
        .send({ message: `Image with id = ${id} is not found` });
    }
    reply.header("Content-Type", picture.toJSON().mimeType);
    reply.send(stream);
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
}

export default imageRead;
