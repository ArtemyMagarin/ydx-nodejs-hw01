/* eslint-env jest */

import fs from "fs";
import path from "path";
import db from "../../src/database/index.js";
import FormData from "form-data";
import { deleteImage } from "../../src/controllers/imageController.js";
import { build } from "../helper.js";
import { __dirname } from "../../src/utils.js";
import { default as _looksSame } from "looks-same";

async function looksSame(img1, img2) {
  return new Promise((resolve, reject) => {
    _looksSame(img1, img2, function (error, data) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

describe("Test merging route", () => {
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

  const upload = async (app, filename) => {
    const image = fs.createReadStream(
      path.resolve(__dirname, "../test/assets", filename)
    );
    const form = new FormData();
    form.append("image", image);
    const res = await app.inject({
      method: "POST",
      url: "/upload",
      payload: form,
      headers: form.getHeaders(),
    });
    const id = res.payload;
    created.push(id);
    return { id, filename };
  };

  test("Trivial merge should work", async () => {
    const bg = await upload(app, "space.png");
    const front = await upload(app, "cat.png");

    expect(bg.filename).toBe("space.png");
    expect(front.filename).toBe("cat.png");

    const res = await app.inject({
      url: "/merge",
      query: {
        front: front.id,
        back: bg.id,
        color: "200,50,52",
        treshold: 3,
      },
    });
    expect(res.headers["content-type"]).toBe("image/png");
    const img1 = fs.readFileSync(
      path.resolve(__dirname, "../test/assets", "result.png")
    );
    const { equal } = await looksSame(img1, res.rawPayload);
    expect(equal).toBe(true);
  });

  test("Different sized images should raise 400 error", async () => {
    const bg = await upload(app, "1.png");
    const front = await upload(app, "cat.png");

    expect(bg.filename).toBe("1.png");
    expect(front.filename).toBe("cat.png");

    const res = await app.inject({
      url: "/merge",
      query: {
        front: front.id,
        back: bg.id,
        color: "200,50,52",
        treshold: 0,
      },
    });
    expect(res.statusCode).toBe(400);
  });

  test("Query with non-existing images should raise 404 error", async () => {
    const res = await app.inject({
      url: "/merge",
      query: {
        front: "whatever1",
        back: "whatever2",
      },
    });
    expect(res.statusCode).toBe(404);
  });

  test("Query without required props should raise 400 error", async () => {
    const res = await app.inject({
      url: "/merge",
      query: {
        color: "200,50,52",
        treshold: 0,
      },
    });
    expect(res.statusCode).toBe(400);
  });
});
