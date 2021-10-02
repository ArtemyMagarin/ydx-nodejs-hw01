/**
 * Props type definition
 * @typedef {Object} Props
 * @property {import('../models/Picture').default} frontPicture front image
 * @property {import('../models/Picture').default} backPicture background image
 * @property {[number, number, number]} color rgb color
 * @property {number} treshold
 */

import { replaceBackground } from "backrem";
import { picture2filename, getFile } from "../utils.js";

/**
 * Merges two images by their id
 * @param {Props} props
 * @returns {Promise<[Error | null, import('stream').Stream | null]>} returns stream or error instanse
 */
export async function mergeImages({
  frontPicture,
  backPicture,
  color,
  treshold,
}) {
  try {
    const stream = await replaceBackground(
      await getFile(picture2filename(frontPicture)),
      await getFile(picture2filename(backPicture)),
      color,
      treshold
    );
    return [null, stream];
  } catch (e) {
    return [e, null];
  }
}
