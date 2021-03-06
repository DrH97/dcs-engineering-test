import supertest from "supertest";
import App from "../src/app";
import { createConnection, getConnection } from "typeorm";
import Lot from "../src/entity/Lot";

const server = new App(3001);
const app = server.app;

beforeAll(async () => {
  await createConnection({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [Lot],
    synchronize: true,
    logging: false
  });
});

afterAll(() => {
  const conn = getConnection();
  return conn.close();
});

describe("Test for input validations on add endpoint", () => {
  it("Checks required validation for quantity", async () => {
    const response = await supertest(app)
      .post("/api/v1/foo/add")
      .send({})
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);

    expect(response.status).toBe(422);
    expect(response.body.errors.body[0].keyword).toBe("required");
  });

  it("Checks numerical validation for quantity", async () => {
    const response = await supertest(app)
      .post("/api/v1/foo/add")
      .send({ quantity: "23" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);

    expect(response.status).toBe(422);
    expect(response.body.errors.body[0].keyword).toBe("type");
  });

  it("Checks minimum validation for quantity", async () => {
    const response = await supertest(app)
      .post("/api/v1/foo/add")
      .send({ quantity: 0 })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);

    expect(response.status).toBe(422);
    expect(response.body.errors.body[0].keyword).toBe("minimum");
  });

  it("Checks numerical validation for expiry", async () => {
    const response = await supertest(app)
      .post("/api/v1/foo/add")
      .send({ quantity: 1, expiry: "23" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);

    expect(response.status).toBe(422);
    expect(response.body.errors.body[0].keyword).toBe("type");
  });

  it("Checks minimum validation for expiry", async () => {
    const response = await supertest(app)
      .post("/api/v1/foo/add")
      .send({ quantity: 1, expiry: 0 })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);

    expect(response.status).toBe(422);
    expect(response.body.errors.body[0].keyword).toBe("minimum");
  });

  it("Checks date validation for expiry on add", async () => {
    const response = await supertest(app)
      .post("/api/v1/foo/add")
      .send({ quantity: 1, expiry: 9120830128309 })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);

    expect(response.status).toBe(422);
    expect(response.body.errors.body[0].keyword).toBe("date");
  });
});

describe("Test for input validations on sell endpoint", () => {
  it("Checks required validation for quantity", async () => {
    const response = await supertest(app)
      .post("/api/v1/foo/sell")
      .send({})
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);

    expect(response.status).toBe(422);
    expect(response.body.errors.body[0].keyword).toBe("required");
  });

  it("Checks numerical validation for quantity", async () => {
    const response = await supertest(app)
      .post("/api/v1/foo/sell")
      .send({ quantity: "23" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);

    expect(response.status).toBe(422);
    expect(response.body.errors.body[0].keyword).toBe("type");
  });

  it("Checks minimum validation for quantity", async () => {
    const response = await supertest(app)
      .post("/api/v1/foo/sell")
      .send({ quantity: 0 })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);

    expect(response.status).toBe(422);
    expect(response.body.errors.body[0].keyword).toBe("minimum");
  });
});
