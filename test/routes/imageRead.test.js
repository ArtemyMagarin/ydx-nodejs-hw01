/* eslint-env jest */

import db from "../../src/database";
import Picture from "../../src/models/Picture";
import { build } from "../helper";

describe("Test retrieve image route", () => {
  const app = build();

  beforeEach(() => {
    db.drop();
  });

  test("Returns Not found error for non-exsiting id", async () => {
    const res = await app.inject({
      url: "/image/whatever",
    });
    expect(res.statusCode).toEqual(404);
  });

  test("Image without real file raises 404 error", async () => {
    new Picture({
      id: 1,
      filename: "test.jpeg",
      size: 1,
      mimeType: "image/jpeg",
    }).save();

    const res = await app.inject({
      url: "/image/1",
    });
    expect(res.statusCode).toEqual(404);
  });
});
