import { URL } from "url";
import path from "path";
import fs from "fs";

export const __dirname = new URL(".", import.meta.url).pathname;

/* Files */

/**
 * Helper type for picture class
 * @typedef {import('./models/Picture').default} Picture
 */

/**
 * Builds filename for picture
 * @param {Picture} picture instance of picture
 * @returns {string} filename for picture
 */
export function picture2filename(picture) {
  const { id, mimeType } = picture.toJSON();
  const ext = mimeType.split("/")[1];
  return `${id}.${ext}`;
}

/**
 * Resolves full path to file
 * @param {string} filename
 * @returns {string} full path to uploaded image
 */
function getUserImagePath(filename) {
  return path.resolve(__dirname, "../userImages", filename);
}

/**
 * Saves file to the disk
 * @param {string} filename
 * @param {import('stream').Readable} fileStream
 * @returns {Promise<void>}
 */
export async function saveFile(filename, fileStream) {
  return new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(getUserImagePath(filename));
    ws.on("error", () => reject());
    ws.on("close", () => resolve());
    fileStream.pipe(ws);
  });
}

/**
 * Deletes file from disk.
 * If file does not exists fails silently
 * @param {string} filename
 * @returns {Promise<void>}
 */
export async function deleteFile(filename) {
  try {
    await fs.promises.unlink(getUserImagePath(filename));
  } catch (e) {
    // just ignore for now
  }
}

/**
 * Checks if file exists on the disk
 * @param {string} filename
 * @returns {Promise<boolean>} file existence
 */
export async function isFileExsists(filename) {
  try {
    await fs.promises.access(getUserImagePath(filename), fs.F_OK);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Returns stream for file,
 * or null if file does not exists
 * @param {string} filename
 * @returns {Promise<fs.ReadStream | null>} readstream for file
 */
export async function getFile(filename) {
  if (await isFileExsists(filename)) {
    return fs.createReadStream(getUserImagePath(filename));
  }
  return null;
}
