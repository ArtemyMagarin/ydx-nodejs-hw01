import fs from "fs";
import path from "path";
import { __dirname } from "../utils.js";
import Picture from "../models/Picture.js";

async function saveFile(filename, buffer) {
  return new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(
      path.resolve(__dirname, "../userImages", filename)
    );
    ws.on("error", reject);
    ws.on("close", resolve);
    buffer.pipe(ws);
  });
}

async function deleteFile(filename) {
  try {
    await fs.promises.unlink(
      path.resolve(__dirname, "../userImages", filename)
    );
  } catch (e) {
    // just ignore for now
  }
}

export async function saveImage({ file, filename, mimeType = "image/jpeg" }) {
  const picture = new Picture({
    filename,
    mimeType,
    size: file.length,
  });
  const { id } = picture.toJSON();
  const ext = mimeType.split("/")[1];
  await saveFile(`${id}.${ext}`, file);
  await picture.save();
  return picture;
}

export async function deleteImage({ id }) {
  const picture = await Picture.find(id);
  if (!picture) {
    return null;
  }
  const { mimeType } = picture.toJSON();
  try {
    await deleteFile(`${id}.${mimeType.split("/")[1]}`);
  } catch (e) {
    // just ignore, ok?
    console.log(e);
  }
  picture.delete();
  return id;
}

export async function listImages() {
  return await Picture.list();
}

export async function retrieveImage({ id }) {
  return await Picture.find(id);
}
