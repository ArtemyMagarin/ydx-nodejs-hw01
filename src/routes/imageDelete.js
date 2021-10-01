import { deleteImage } from "../controllers/imageController.js";

export default async function imageDelete(req, reply) {
  try {
    const id = await deleteImage({ id: req.params.id });
    if (id === null) {
      reply.status(404).send({ message: `Image with id = ${id} is not found` });
    } else {
      reply.send({ id });
    }
  } catch (e) {
    throw new Error(e.message);
  }
}
