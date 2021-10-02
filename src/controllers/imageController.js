import { saveFile, deleteFile, picture2filename } from "../utils.js";
import Picture from "../models/Picture.js";

export async function saveImage({ file, filename, mimeType = "image/jpeg" }) {
  const picture = new Picture({
    filename,
    mimeType,
    size: file.length,
  });
  await saveFile(picture2filename(picture), file);
  await picture.save();
  return picture;
}

export async function deleteImage({ id }) {
  const picture = await Picture.find(id);
  if (!picture) {
    return null;
  }
  await deleteFile(picture2filename(picture));
  await picture.delete();
  return id;
}

export async function listImages() {
  return await Picture.list();
}

export async function retrieveImage({ id }) {
  return await Picture.find(id);
}
