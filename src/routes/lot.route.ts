import express from "express";
import * as controller from '../controllers/lot.controller';

const router = express.Router();

router.get('/:item/quantity', controller.getQuantity);
router.post('/:item/add', controller.addLot)
router.post('/:item/sell', controller.sellItem)

export = router;