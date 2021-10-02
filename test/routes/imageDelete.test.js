/* eslint-env jest */

import fs from "fs";
import path from "path";
import { __dirname } from "../../src/utils.js";
import FormData from "form-data";

import db from "../../src/database/index.js";
import Picture from "../../src/models/Picture.js";
import { build } from "../helper.js";

describe("Test delete image", () => {
  const app = build();

  beforeEach(() => {
    db.drop();
  });

  test("Attempt to delete non-existing image shuld return 404 error", async () => {
    const res = await app.inject({
      method: "DELETE",
      url: "/image/whatewer",
    });
    expect(res.statusCode).toEqual(404);
  });

  test("Can delete image by id", async () => {
    new Array(3).fill(null).forEach((_, id) => {
      new Picture({
        id: `${id}`,
        filename: "test.jpeg",
        size: 1,
        mimeType: "image/jpeg",
      }).save();
    });

    const res = await app.inject({
      method: "DELETE",
      url: "/image/1",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.json()).toEqual({ id: "1" });

    const res2 = await app.inject({
      method: "DELETE",
      url: "/image/0",
    });
    expect(res2.statusCode).toEqual(200);
    expect(res2.json()).toEqual({ id: "0" });
  });

  test("deleting image also deletes file from fs", async () => {
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

    expect(
      async () =>
        await fs.promises.access(
          path.resolve(__dirname, "../userImages", `${id}.png`),
          fs.F_OK
        )
    ).not.toThrow();

    await app.inject({
      method: "DELETE",
      url: `/image/${id}`,
    });

    await expect(
      fs.promises.access(
        path.resolve(__dirname, "../userImages", `${id}.png`),
        fs.F_OK
      )
    ).rejects.toThrow();
  });
});
