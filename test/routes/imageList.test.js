/* eslint-env jest */

import db from "../../src/database";
import Picture from "../../src/models/Picture";
import { build } from "../helper";

describe("Test retrieve list of images route", () => {
  const app = build();

  beforeEach(() => {
    db.drop();
  });

  test("Returns empty list for empty db", async () => {
    const res = await app.inject({
      url: "/list",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.json()).toEqual([]);
  });

  test("Can retrieve existing image", async () => {
    new Array(3).fill().forEach((_, id) => {
      new Picture({
        id: id,
        filename: "test.jpeg",
        size: 1,
        mimeType: "image/jpeg",
      }).save();
    });

    const res = await app.inject({
      url: "/list",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.json().length).toEqual(3);
  });
});
