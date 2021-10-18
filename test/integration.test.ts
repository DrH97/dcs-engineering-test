import { createConnection, getConnection } from "typeorm";

import supertest from "supertest";
import Lot from "../src/entity/Lot";
import App from "../src/app";

const server = new App(3000);
const request = supertest(server.app);

beforeAll(async () => {
  // server.listen();
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

// This function performs server requests in a future time
// Needs checking
// const performFuturePostAction = (status: number, data: Object, timeout: number): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       request
//         .post("/api/v1/foo/add")
//         .set("Accept", "application/json")
//         .send(data)
//         .expect("Content-Type", /json/)
//         .expect(201)
//         .then(response => {
//           resolve(response);
//
//         })
//         .catch(err => reject(err));
//
//     }, timeout);
//
//   });
// };

describe("Test for item foo", () => {
  const t0 = new Date().valueOf();

  it("1. adds lot to db successfully", (done) => {
    const t = 0;

    setTimeout(() => {
      return request
        .post("/api/v1/foo/add")
        .set("Accept", "application/json")
        .send({ expiry: t0 + 10000, quantity: 10 })
        .expect("Content-Type", /json/)
        .expect(201)
        .then((response) => {
          expect(new Date(response.body.expiry).valueOf()).toBeGreaterThan(
            new Date().valueOf()
          );
          expect(response.body.quantity).toBe(10);

          done();
        })
        .catch((err) => done(err));
    }, t);
  });

  it("2. gets valid lot quantity from db by name", (done) => {
    const t = t0 + 5000 - new Date().valueOf();

    setTimeout(async () => {
      return request
        .get("/api/v1/foo/quantity")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.quantity).toBe(10);
          expect(response.body.validTill).toBeLessThanOrEqual(t0 + 10000);

          done();
        })
        .catch((err) => done(err));
    }, t);
  });

  it("3. add lots", (done) => {
    const t = t0 + 7000 - new Date().valueOf();

    setTimeout(() => {
      return request
        .post("/api/v1/foo/add")
        .set("Accept", "application/json")
        .send({ expiry: t0 + 20000, quantity: 5 })
        .expect("Content-Type", /json/)
        .expect(201)
        .then((response) => {
          expect(new Date(response.body.expiry).valueOf()).toBeGreaterThan(
            new Date().valueOf()
          );
          expect(response.body.quantity).toBe(5);

          done();
        })
        .catch((err) => done(err));
    }, t);
  });

  it("4. gets valid lot quantity from db by name", (done) => {
    const t = t0 + 8000 - new Date().valueOf();

    setTimeout(() => {
      return request
        .get("/api/v1/foo/quantity")
        .set("Accept", "application/json")
        .send({ expiry: t0 + 10000, quantity: 10 })
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.quantity).toBe(15);
          expect(response.body.validTill).toBeLessThanOrEqual(t0 + 10000);

          done();
        })
        .catch((err) => done(err));
    }, t);
  });

  it("5. gets valid lot quantity from db by name", (done) => {
    const t = t0 + 10000 - new Date().valueOf();

    setTimeout(() => {
      return request
        .get("/api/v1/foo/quantity")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.quantity).toBe(5);
          expect(response.body.validTill).toBeLessThanOrEqual(t0 + 20000);

          done();
        })
        .catch((err) => done(err));
    }, t);
  });

  it("6. sell lots", (done) => {
    const t = t0 + 12000 - new Date().valueOf();

    setTimeout(() => {
      return request
        .post("/api/v1/foo/sell")
        .set("Accept", "application/json")
        .send({ quantity: 3 })
        .expect("Content-Type", /json/)
        .expect(201)
        .then((response) => {
          expect(new Date(response.body[0].expiry).valueOf()).toBeGreaterThan(
            new Date().valueOf()
          );
          expect(response.body[0].quantity).toBeGreaterThan(0);

          done();
        })
        .catch((err) => done(err));
    }, t);
  });

  it("7. gets valid lot quantity from db by name", (done) => {
    const t = t0 + 13000 - new Date().valueOf();

    setTimeout(() => {
      return request
        .get("/api/v1/foo/quantity")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.quantity).toBe(2);
          expect(response.body.validTill).toBeLessThanOrEqual(t0 + 20000);

          done();
        })
        .catch((err) => done(err));
    }, t);
  });

  it("8. gets valid lot quantity from db by name", (done) => {
    const t = t0 + 20000 - new Date().valueOf();

    setTimeout(() => {
      return request
        .get("/api/v1/foo/quantity")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.quantity).toBe(0);
          expect(response.body.validTill).toBe(null);

          done();
        })
        .catch((err) => done(err));
    }, t);
  });
});

// describe("Test for item bar", () => {
//   const t0 = new Date().valueOf();
//
//   it("1. adds lot to db successfully", async () => {
//     const t = t0 - new Date().valueOf();
//
//     setTimeout(async () => {
//       const response = await supertest(app)
//         .post("/api/v1/bar/add")
//         .send({ expiry: t0 + 10000, quantity: 10 })
//         .set("Accept", "application/json");
//       // .expect("Content-Type", /json/);
//
//       expect(response.statusCode).toBe(201);
//
//       expect(new Date(response.body.expiry).valueOf()).toBeGreaterThan(
//         new Date().valueOf()
//       );
//       expect(response.body.quantity).toBe(10);
//     }, t);
//   });
//
//   it("2. adds lot to db successfully", async () => {
//     const t = t0 + 1000 - new Date().valueOf();
//
//     setTimeout(async () => {
//       const response = await supertest(app)
//         .post("/api/v1/bar/add")
//         .send({ expiry: t0 + 15000, quantity: 10 })
//         .set("Accept", "application/json");
//       // .expect("Content-Type", /json/);
//
//       expect(response.statusCode).toBe(201);
//
//       expect(new Date(response.body.expiry).valueOf()).toBeGreaterThan(
//         new Date().valueOf()
//       );
//       expect(response.body.quantity).toBe(10);
//     }, t);
//   });
//
//   it("3. adds lot to db successfully", async () => {
//     const t = t0 + 2000 - new Date().valueOf();
//
//     setTimeout(async () => {
//       const response = await supertest(app)
//         .post("/api/v1/bar/add")
//         .send({ expiry: t0 + 20000, quantity: 10 })
//         .set("Accept", "application/json");
//       // .expect("Content-Type", /json/);
//
//       expect(response.statusCode).toBe(201);
//
//       expect(new Date(response.body.expiry).valueOf()).toBeGreaterThan(
//         new Date().valueOf()
//       );
//       expect(response.body.quantity).toBe(10);
//     }, t);
//   });
//
//   it("4. gets valid lot quantity from db by name", async () => {
//     const t = t0 + 3000 - new Date().valueOf();
//
//     setTimeout(async () => {
//       const response = await supertest(app).get("/api/v1/bar/quantity");
//       // .expect("Content-Type", /json/);
//
//       expect(response.statusCode).toBe(200);
//
//       expect(response.body.quantity).toBe(30);
//       expect(response.body.validTill).toBeLessThanOrEqual(t0 + 10000);
//     }, t);
//   });
//
//   it("5. sell lots", async () => {
//     const t = t0 + 5000 - new Date().valueOf();
//
//     setTimeout(async () => {
//       const response = await supertest(app)
//         .post("/api/v1/bar/sell")
//         .send({ quantity: 5 })
//         .set("Accept", "application/json");
//       // .expect("Content-Type", /json/);
//
//       expect(response.statusCode).toBe(201);
//
//       expect(new Date(response.body[0].expiry).valueOf()).toBeGreaterThan(
//         new Date().valueOf()
//       );
//       expect(response.body[0].quantity).toBeGreaterThan(0);
//     }, t);
//   });
//
//   it("6. gets valid lot quantity from db by name", async () => {
//     const t = t0 + 7000 - new Date().valueOf();
//
//     setTimeout(async () => {
//       const response = await supertest(app).get("/api/v1/bar/quantity");
//       // .expect("Content-Type", /json/);
//
//       expect(response.statusCode).toBe(200);
//
//       expect(response.body.quantity).toBe(25);
//       expect(response.body.validTill).toBeLessThanOrEqual(t0 + 10000);
//     }, t);
//   });
//
//   it("7. gets valid lot quantity from db by name", async () => {
//     const t = t0 + 10000 - new Date().valueOf();
//
//     setTimeout(async () => {
//       const response = await supertest(app).get("/api/v1/bar/quantity");
//       // .expect("Content-Type", /json/);
//
//       expect(response.statusCode).toBe(200);
//
//       expect(response.body.quantity).toBe(20);
//       expect(response.body.validTill).toBeLessThanOrEqual(t0 + 15000);
//     }, t);
//   });
//
//   it("8. sell lots", async () => {
//     const t = t0 + 13000 - new Date().valueOf();
//
//     setTimeout(async () => {
//       const response = await supertest(app)
//         .post("/api/v1/bar/sell")
//         .send({ quantity: 13 })
//         .set("Accept", "application/json");
//       // .expect("Content-Type", /json/);
//
//       expect(response.statusCode).toBe(201);
//
//       expect(new Date(response.body[0].expiry).valueOf()).toBeGreaterThan(
//         new Date().valueOf()
//       );
//       expect(response.body[0].quantity).toBeGreaterThan(0);
//     }, t);
//   });
//
//   it("9. gets valid lot quantity from db by name", async () => {
//     const t = t0 + 14000 - new Date().valueOf();
//
//     setTimeout(async () => {
//       const response = await supertest(app).get("/api/v1/bar/quantity");
//       // .expect("Content-Type", /json/);
//
//       expect(response.statusCode).toBe(200);
//
//       expect(response.body.quantity).toBe(7);
//       expect(response.body.validTill).toBeLessThanOrEqual(t0 + 20000);
//     }, t);
//   });
//
//   it("10. gets valid lot quantity from db by name", async () => {
//     const t = t0 + 17000 - new Date().valueOf();
//
//     setTimeout(async () => {
//       const response = await supertest(app).get("/api/v1/bar/quantity");
//       // .expect("Content-Type", /json/);
//
//       expect(response.statusCode).toBe(200);
//
//       expect(response.body.quantity).toBe(7);
//       expect(response.body.validTill).toBeLessThanOrEqual(t0 + 20000);
//     }, t);
//   });
//
//   it("11. gets valid lot quantity from db by name", async () => {
//     const t = t0 + 20000 - new Date().valueOf();
//
//     setTimeout(async () => {
//       const response = await supertest(app).get("/api/v1/bar/quantity");
//       // .expect("Content-Type", /json/);
//
//       expect(response.statusCode).toBe(200);
//
//       expect(response.body.quantity).toBe(0);
//       expect(response.body.validTill).toBe(null);
//     }, t);
//   });
// });
