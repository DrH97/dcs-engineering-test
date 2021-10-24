import { Request, Response } from "express";
import Lot from "../entity/Lot";
import { BaseLot } from "../interfaces/lot.interface";
import { sendErrResponse } from "../common/errors";
import { findLotsByName } from "../common/utils";

import workerpool from "workerpool";
import { getConnection, In } from "typeorm";
import * as path from "path";

const pool = workerpool.pool(path.join(__dirname, "/../common/worker.js"));

// Retrieve Item quantity
const getQuantity = async (req: Request, res: Response) => {
  const item: string = req.params.item;

  try {
    // Find all lots by item name
    const lotsByItemName: Lot[] = await findLotsByName(item);

    // Perform quantity sum calculations
    const quantityObj = await pool.exec("calculateLotsQuantitySum", [
      lotsByItemName
    ]);

    // Send back data
    res.status(200).json(quantityObj);
  } catch (e) {
    sendErrResponse(res, 500, (e as Error).message);
  }
};

// Add Lot
const addLot = async (req: Request, res: Response) => {
  const item: string = req.params.item;

  try {
    // Get request body
    const body = req.body;

    const lot = new Lot();
    lot.name = item;
    lot.quantity = body.quantity;
    lot.expiry = new Date(body.expiry);

    // Check milliseconds passed gives us valid date
    if (!lot.expiry.getMonth()) {
      const errbody = {
        keyword: "date",
        dataPath: ".expiry",
        message: "should be a valid timestamp"
      };

      sendErrResponse(res, 422, { body: [errbody] });
      return;
    }

    await lot.save();

    // Send back data
    res.status(201).json(lot);
  } catch (e) {
    sendErrResponse(res, 500, (e as Error).message);
  }
};

// Sell Item
const sellItem = async (req: Request, res: Response) => {
  const item: string = req.params.item;

  try {
    // Get body
    const body: BaseLot = req.body;

    // Get valid Lots
    const validLots: Lot[] = await findLotsByName(item);

    // Check quantity is enough
    const sum = await pool.exec("totalLotsQuantity", [validLots]);

    if (body.quantity > sum) {
      const errbody = {
        keyword: "max",
        dataPath: ".quantity",
        message: "sell quantity requested cannot be matched"
      };

      sendErrResponse(res, 422, { body: [errbody] });
      return;
    }

    // Subtract quantity from relevant lots accordingly
    // Save/Update lots
    const result = await pool.exec("sellLots", [validLots, body.quantity]);

    //    Delete finished lots
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Lot)
      .where({ id: In(result.finishedLots) })
      .execute();

    //    Save Modified pending lot
    if (Object.keys(result.modifiedLot).length !== 0) {
      await getConnection()
        .createQueryBuilder()
        .update(Lot)
        .set({ ...result.modifiedLot })
        .where("id = :id", { id: result.modifiedLot.id })
        .execute();
    }

    // Get response object
    // Send back data
    res.status(201).json(await findLotsByName(item));
  } catch (e) {
    sendErrResponse(res, 500, (e as Error).message);
  }
};

export { addLot, sellItem, getQuantity };
