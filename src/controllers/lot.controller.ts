import {NextFunction, Request, Response} from 'express';
import {sendErrResponse} from "../common/errors";
import {Lot} from "../entity/Lot";
import {BaseLot, CommonLot} from "../interfaces/lot.interface";
import {getConnection, In} from "typeorm";


const sellLots = async (lots: Lot[], sellQuantity: number) => {
    let finishedLots: number[] = [], modifiedLot: Lot = new Lot();

    // TODO: Use every instead?
    lots.map((lot) => {
        if (sellQuantity >= lot.quantity) {
            finishedLots.push(lot.id);
            sellQuantity -= lot.quantity;
        } else {
            if (sellQuantity > 0) {
                lot.quantity -= sellQuantity;
                modifiedLot = lot;
                sellQuantity = 0;
            }
        }

    });

    //    Delete finished lots
    await getConnection()
        .createQueryBuilder()
        .delete()
        .from(Lot)
        .where({id: In(finishedLots)})
        .execute();

//    Save Modified pending lot
//    TODO: Check on this function
    if (Object.keys(modifiedLot).length !== 0) {
        await getConnection()
            .createQueryBuilder()
            .update(Lot)
            .set({...modifiedLot})
            .where("id = :id", {id: modifiedLot.id})
            .execute();

    }
}

// Retrieve Item quantity
const getQuantity = async (req: Request, res: Response) => {
    const item: string = req.params.item;

    try {
        // Find all lots by item name
        let lotsByItemName: Lot[] = await Lot.findNonExpired(item);

        // Perform quantity sum calculations
        lotsByItemName = lotsByItemName.filter((lot) => lot.expiry > new Date());

        // Do a summation of lot quantities
        const sum = lotsByItemName.reduce((acc, val) => acc + val.quantity, 0);

        // Get return object
        lotsByItemName.sort((a, b) => a.expiry.valueOf() - b.expiry.valueOf());

        const quantityObj =  {
            quantity: sum,
            validTill: sum > 0 ? lotsByItemName.reverse().pop()?.expiry.valueOf() : null
        }

        // Send back data
        res.status(200).send(quantityObj);
    } catch (e) {
        sendErrResponse(res, 500, (e as Error).message)
    }
}

// Add Lot
const addLot = async (req: Request, res: Response) => {
    const item: string = req.params.item;

    try {
        // Get request body
        const body: CommonLot = req.body

        // Create new Lot
        const lot = new Lot();
        lot.name = item;
        lot.quantity = body.quantity;
        lot.expiry = new Date(body.expiry);

        // Check milliseconds passed gives us valid date
        if (!lot.expiry.getMonth()) {
            const errbody = {
                "keyword": "date",
                "dataPath": ".expiry",
                "message": "should be a valid timestamp"
            };

            sendErrResponse(res, 422, {body: [errbody]})
            return;
        }

        await lot.save();

        // Send back data
        res.status(201).send(lot);
    } catch (e) {
        sendErrResponse(res, 500, (e as Error).message)
    }
}

// Sell Item
const sellItem = async (req: Request, res: Response, next: NextFunction) => {
    const item: string = req.params.item;

    try {
        // Get body
        const body: BaseLot = req.body

        // Get valid Lots
        let validLots: Lot[] = await Lot.findNonExpired(item);

        // Check quantity is enough
        const sum = validLots.reduce((acc, val) => acc + val.quantity, 0);

        if (body.quantity > sum) {
            const errbody = {
                "keyword": "max",
                "dataPath": ".quantity",
                "message": "sell quantity requested cannot be matched"
            };

            sendErrResponse(res, 422, {body: [errbody]});
            return;
        }

        // Subtract quantity from relevant lots accordingly
        validLots.sort((a, b) => a.expiry.valueOf() - b.expiry.valueOf())

        // Save/Update lots
        await sellLots(validLots, body.quantity)

        // Get response object
        const resObject = await Lot.findNonExpired(item);

        // Send back data
        res.status(201).send(resObject);
    } catch (e) {
        sendErrResponse(res, 500, (e as Error).message)
    }
}

export {
    addLot,
    sellItem,
    getQuantity
}