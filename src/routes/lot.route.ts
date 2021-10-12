import express from "express";
import { Validator } from "express-json-validator-middleware";
import * as controller from "../controllers/lot.controller";
import { lotCreateSchema, lotSellSchema } from "../schemas/lot.schema";

const { validate } = new Validator({});

const router = express.Router();

router.get("/:item/quantity", controller.getQuantity);

router.post(
  "/:item/add",
  validate({ body: lotCreateSchema }),
  controller.addLot
);
router.post(
  "/:item/sell",
  validate({ body: lotSellSchema }),
  controller.sellItem
);

export default router;
