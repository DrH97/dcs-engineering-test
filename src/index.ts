import "reflect-metadata";
import { createConnection } from "typeorm";
import App from "./app";
import { logger } from "./common/utils";

const PORT: any = process.env.PORT || 3000;

const app = new App(PORT);

createConnection()
  .then(() => {
    /** Server */
    app.listen();
  })
  .catch((e) => {
    logger(e);
    console.log("Could not connect to database! Check configs or connection.");
  });
