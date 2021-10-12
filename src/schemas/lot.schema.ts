import { JSONSchema7 } from "json-schema";

const lotCreateSchema: JSONSchema7 = {
    type: "object" as const,
    required: ["quantity", "expiry"],
    properties: {
        quantity: {
            type: "number",
            minimum: 1,
        },
        expiry: {
            type: "number",
            minimum: new Date().valueOf()
        },
    },
};


const lotSellSchema: JSONSchema7 = {
    type: "object",
    required: ["quantity"],
    properties: {
        quantity: {
            type: "number",
            minimum: 1,
        },
    },
};

export { lotCreateSchema, lotSellSchema };