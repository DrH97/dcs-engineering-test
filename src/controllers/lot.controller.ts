import { Request, Response } from "express";
import { Lot } from "../entity/Lot";
import { BaseLot } from "../interfaces/lot.interface";
import { sendErrResponse } from "../common/errors";
import {
  calculateLotsQuantitySum,
  findLotsByName,
  sellLots,
  sortLotsByExpiry,
  totalLotsQuantity
} from "../common/utils";

// Retrieve Item quantity
const getQuantity = async (req: Request, res: Response) => {
  const item: string = req.params.item;

  try {
    // Find all lots by item name
    const lotsByItemName: Lot[] = await findLotsByName(item);

    // Perform quantity sum calculations
    const quantityObj = calculateLotsQuantitySum(lotsByItemName);

    // Send back data
    res.status(200).send(quantityObj);
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
    res.status(201).send(lot);
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
    const sum = totalLotsQuantity(validLots);

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
    sortLotsByExpiry(validLots);
    await sellLots(validLots, body.quantity);

    // Get response object
    // Send back data
    res.status(201).send(await findLotsByName(item));
  } catch (e) {
    sendErrResponse(res, 500, (e as Error).message);
  }
};

export { addLot, sellItem, getQuantity };
