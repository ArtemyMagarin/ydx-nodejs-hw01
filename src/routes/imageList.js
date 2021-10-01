import { listImages } from "../controllers/imageController.js";

export default async function imageList() {
  return await listImages();
}
