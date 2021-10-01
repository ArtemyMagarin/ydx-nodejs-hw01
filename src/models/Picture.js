import { nanoid } from "nanoid";
import db from "../database/index.js";

export default class Picture {
  _id;
  _filename;
  _mimeType;
  _size;
  _uploadedAt;

  constructor({
    id = nanoid(),
    filename,
    mimeType,
    size,
    uploadedAt = Date.now(),
  }) {
    this._id = id;
    this._filename = filename;
    this._mimeType = mimeType;
    this._size = size;
    this._uploadedAt = uploadedAt;
  }

  static async find(id) {
    const data = await db.find("pictures", id);
    return data ? new Picture(data) : null;
  }

  static async list() {
    return await db.list("pictures");
  }

  async save() {
    await db.createOrUpdate("pictures", this._id, this.toJSON());
    return this.toJSON();
  }

  async delete() {
    db.delete("pictures", this._id);
    return this._id;
  }

  toJSON() {
    return this.toPublicJson();
  }

  toPublicJson() {
    return {
      id: this._id,
      filename: this._filename,
      mimeType: this._mimeType,
      size: this._size,
      uploadedAt: this._uploadedAt,
    };
  }
}
