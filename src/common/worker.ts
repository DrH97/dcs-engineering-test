import workerpool from "workerpool";
import Lot from "../entity/Lot";
import { getFirstLot, sortLotsByExpiry } from "./utils";

const totalLotsQuantity = async (lots: Lot[]) => {
  return lots.reduce((acc, val) => acc + val.quantity, 0);
};

const calculateLotsQuantitySum = async (lots: Lot[]) => {
  // Filter out those that may be expired and not removed yet
  // Might no longer be needed since it is being done in the SQL query
  // lotsByItemName = lotsByItemName.filter((lot) => lot.expiry > new Date());

  // Do a summation of lot quantities
  const sum = await totalLotsQuantity(lots);

  // Get return object
  sortLotsByExpiry(lots);

  return {
    quantity: sum,
    validTill: sum > 0 ? getFirstLot(lots)?.expiry.valueOf() : null
  };
};

const sellLots = async (lots: Lot[], sellQuantity: number) => {
  const finishedLots: number[] = [];
  let modifiedLot: Lot = new Lot();

  lots.every((lot) => {
    if (sellQuantity >= lot.quantity) {
      finishedLots.push(lot.id);
      sellQuantity -= lot.quantity;
    } else {
      if (sellQuantity > 0) {
        lot.quantity -= sellQuantity;
        modifiedLot = lot;
        sellQuantity = 0;

        return false;
      }
    }

    return true;
  });

  return {
    finishedLots,
    modifiedLot
  };
};

workerpool.worker({
  totalLotsQuantity,
  calculateLotsQuantitySum,
  sellLots
});
