import {NextFunction, Request, Response} from 'express';
import {sendErrResponse} from "../common/errors";
import {Lot} from "../entity/Lot";


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


        // Create new Lot


        // Send back data
        res.status(201).send({});
    } catch (e) {
        sendErrResponse(res, 500, (e as Error).message)
    }
}

// Sell Item
const sellItem = async (req: Request, res: Response, next: NextFunction) => {
    const item: string = req.params.item;

    try {
        // Get body


        // Get valid Lots


        // Check quantity is enough


        // Subtract quantity from relevant lots accordingly


        // Save/Update lots


        // Get response object


        // Send back data
        res.status(201).send({});
    } catch (e) {
        sendErrResponse(res, 500, (e as Error).message)
    }
}

export {
    addLot,
    sellItem,
    getQuantity
}