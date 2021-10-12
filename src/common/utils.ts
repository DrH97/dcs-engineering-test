import Lot from "../entity/Lot";
import { getConnection, In } from "typeorm";

const findLotsByName = async (item: string) => {
  return await Lot.findNonExpired(item);
};

const totalLotsQuantity = (lots: Lot[]) => {
  return lots.reduce((acc, val) => acc + val.quantity, 0);
};

// Might not be needed if we do it in db
const sortLotsByExpiry = (lots: Lot[]) => {
  lots.sort((a, b) => a.expiry.valueOf() - b.expiry.valueOf());
};

const calculateLotsQuantitySum = (lots: Lot[]) => {
  // Filter out those that may be expired and not removed yet
  // Might no longer be needed since it is being done in the SQL query
  // lotsByItemName = lotsByItemName.filter((lot) => lot.expiry > new Date());

  // Do a summation of lot quantities
  const sum = totalLotsQuantity(lots);

  // Get return object
  sortLotsByExpiry(lots);

  return {
    quantity: sum,
    validTill: sum > 0 ? getFirstLot(lots)?.expiry.valueOf() : null
  };
};

const getFirstLot = (lots: Lot[]) => {
  return lots.reverse().pop();
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

  //    Delete finished lots
  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Lot)
    .where({ id: In(finishedLots) })
    .execute();

  //    Save Modified pending lot
  if (Object.keys(modifiedLot).length !== 0) {
    await getConnection()
      .createQueryBuilder()
      .update(Lot)
      .set({ ...modifiedLot })
      .where("id = :id", { id: modifiedLot.id })
      .execute();
  }
};

// Clear expired lots
const clearExpiredLots = async () => {
  try {
    //    Delete expired lots
    const re = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Lot)
      .where("expiry > :expiry", { expiry: new Date() })
      .execute();

    console.log(`Cleared ${re.affected} expired lots!`);
  } catch (e) {
    logger(e);
  }
};

const logger = (message: string | object | unknown) => {
  console.error(new Date().toISOString() + "\t" + message);
};

export {
  clearExpiredLots,
  findLotsByName,
  totalLotsQuantity,
  calculateLotsQuantitySum,
  getFirstLot,
  sortLotsByExpiry,
  sellLots,
  logger
};
