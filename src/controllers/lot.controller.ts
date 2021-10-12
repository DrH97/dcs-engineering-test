import {NextFunction, Request, Response} from 'express';
import {sendErrResponse} from "../common/errors";


// Retrieve Item quantity
const getQuantity = async (req: Request, res: Response) => {
    const item: string = req.params.item;

    try {
        // Find all lots by item name


        // Perform quantity sum calculations


        // Send back data
        res.status(200).send({});
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