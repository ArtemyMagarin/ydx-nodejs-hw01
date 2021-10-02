import { mergeImages } from "../controllers/mergeController.js";
import Picture from "../models/Picture.js";
import { isFileExsists, picture2filename } from "../utils.js";

function validateColor(color) {
  if (!color.match(/(\d{1,3},){2}\d{1,3}/)) {
    return false;
  }
  return color
    .split(",")
    .map((item) => +item)
    .every((num) => num > 0 && num < 256);
}

export default async function merge(req, reply) {
  const { front, back, color = "255,255,255", treshold = 0 } = req.query;
  if (!front || !back) {
    return reply
      .code(400)
      .send({ message: "back and front are required fields" });
  }
  if (!validateColor(color)) {
    return reply.code(400).send({ message: "color is invalid" });
  }
  if (isNaN(+treshold) || +treshold < 0) {
    return reply
      .code(400)
      .send({ message: "treshold must be a valid positive number" });
  }

  const frontPicture = await Picture.find(front);
  const backPicture = await Picture.find(back);
  if (
    !frontPicture ||
    !backPicture ||
    !isFileExsists(picture2filename(frontPicture)) ||
    !isFileExsists(picture2filename(backPicture))
  ) {
    return reply.code(404).send({ message: "image does not exist" });
  }

  try {
    const [err, stream] = await mergeImages({
      frontPicture,
      backPicture,
      color: color.split(",").map((item) => +item),
      treshold: +treshold,
    });
    if (err) {
      return reply.code(400).send({ message: err.message });
    }
    return reply
      .header("content-type", frontPicture.toJSON().mimeType)
      .send(stream);
  } catch (e) {
    return reply.code(500).send({ message: "Unexpected server error" });
  }
}
