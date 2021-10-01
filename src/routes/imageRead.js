import { retrieveImage } from "../controllers/imageController.js";

async function imageRead(req, reply) {
  const { id } = req.params;
  try {
    const picture = await retrieveImage({ id });
    if (picture) {
      return picture.toPublicJson();
    } else {
      reply.status(404).send({ message: `Image with id = ${id} is not found` });
    }
  } catch (e) {
    throw new Error(e.message);
  }
}

export default {
  handler: imageRead,
};
