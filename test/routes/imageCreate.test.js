/* eslint-env jest */

import db from "../../src/database/index.js";
import path from "path";
import FormData from "form-data";
import fs from "fs";
import { build } from "../helper.js";
import { deleteImage } from "../../src/controllers/imageController.js";
import { __dirname } from "../../src/utils.js";

describe("Test create image", () => {
  const app = build();
  let created = [];

  beforeEach(() => {
    db.drop();
  });

  afterEach(async () => {
    for (let i = 0; i < created.length; i++) {
      await deleteImage({ id: created[i] });
    }
    created = [];
  });

  test("Attempt to create image with empty payload", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/upload",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    expect(res.statusCode).toEqual(400);
  });

  test("Upload image", async () => {
    const image = fs.createReadStream(
      path.resolve(__dirname, "../test/assets/1.png")
    );
    const form = new FormData();
    form.append("image", image);

    const res = await app.inject({
      method: "POST",
      url: "/upload",
      payload: form,
      headers: form.getHeaders(),
    });
    expect(res.statusCode).toEqual(201);
    const id = res.payload;
    created.push(id);

    const { headers } = await app.inject({
      url: `/image/${id}`,
    });
    expect(headers["content-type"]).toBe("image/png");
  });
});
