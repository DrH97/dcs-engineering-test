import { createConnection, getConnection, getRepository } from "typeorm";
import Lot from "../src/entity/Lot";
import {
  calculateLotsQuantitySum,
  getFirstLot,
  sellLots,
  sortLotsByExpiry
} from "../src/common/utils";
import supertest from "supertest";
import App from "../src/app";

const server = new App(3002);
const app = server.app;

beforeAll(async () => {
  await createConnection({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [Lot],
    synchronize: true,
    logging: false
  }).then(async () => {
    await setUpDb();
  });
});

afterAll(() => {
  const conn = getConnection();
  return conn.close();
});

const setUpDb = async () => {
  const timestamp = new Date().valueOf();

  const lots = [
    {
      name: "foo",
      quantity: 5,
      expiry: new Date(timestamp)
    },
    {
      name: "foo",
      quantity: 5,
      expiry: new Date(timestamp + 20000)
    },
    {
      name: "foo",
      quantity: 5,
      expiry: new Date(timestamp + 15000)
    }
  ];

  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Lot)
    .values(lots)
    .execute();
};

describe("DB Tests", () => {
  const lot = new Lot();

  it("Add Lot", async () => {
    lot.name = "foo";
    lot.quantity = 5;
    lot.expiry = new Date();

    await lot.save();

    const response = await Lot.findOne({ id: lot.id });

    expect(response).toStrictEqual(lot);
  });

  it("Update Lot", async () => {
    lot.name = "bar";
    lot.quantity = 50;

    await getConnection()
      .createQueryBuilder()
      .update(Lot)
      .set({ ...lot })
      .where("id = :id", { id: lot.id })
      .execute();

    const response = await Lot.findOne({ id: lot.id });

    expect(response).toStrictEqual(lot);
  });

  it("Delete Lot", async () => {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Lot)
      .where({ id: lot.id })
      .execute();

    const response = await Lot.findOne({ id: lot.id });

    expect(response).toBeUndefined();
  });
});

describe("Controller Tests", () => {
  it("get quantity of only valid lots", async () => {
    const lots: Lot[] = await Lot.findNonExpired("foo");

    const x = [...lots];

    const response = calculateLotsQuantitySum(lots);

    sortLotsByExpiry(x);
    const lot = getFirstLot(x);

    expect(response).toStrictEqual({
      quantity: 10,
      validTill: lot?.expiry.valueOf()
    });
  });

  it("Ensure sell quantity is checked", async () => {
    const response = await supertest(app)
      .post("/api/v1/foo/sell")
      .send({ quantity: 100 })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);

    expect(response.status).toBe(422);
    expect(response.body.errors.body[0].keyword).toBe("max");
  });

  it("check selling across lots", async () => {
    let lots: Lot[] = await getRepository(Lot)
      .createQueryBuilder("lot")
      .where("name = :name", { name: "foo" })
      .andWhere("strftime('%s', expiry) > strftime('%s','now')")
      .andWhere("quantity > 0")
      .getMany();

    sortLotsByExpiry(lots);
    await sellLots(lots, 6);

    lots = await getRepository(Lot)
      .createQueryBuilder("lot")
      .where("name = :name", { name: "foo" })
      .andWhere("strftime('%s', expiry) > strftime('%s','now')")
      .andWhere("quantity > 0")
      .getMany();

    const x = [...lots];

    const response = calculateLotsQuantitySum(lots);

    sortLotsByExpiry(x);
    const lot = getFirstLot(x);

    expect(response).toStrictEqual({
      quantity: 4,
      validTill: lot?.expiry.valueOf()
    });
  });
});
