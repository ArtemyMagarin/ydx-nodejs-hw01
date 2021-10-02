import { saveImage } from "../controllers/imageController.js";

async function imageCreate(req, reply) {
  try {
    const { file, filename, mimetype } = await req.file();
    const picture = await saveImage({ file, filename, mimeType: mimetype });
    reply.status(201).send(picture.toPublicJson().id);
  } catch (e) {
    reply.status(400).send({ message: "Unable to save your image" });
  }
}

export default imageCreate;
