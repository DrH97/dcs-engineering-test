import "reflect-metadata";
import { createConnection } from "typeorm";
import App from "./app";

const PORT: any = process.env.PORT || 7000;

const app = new App(
    PORT
);

createConnection()
  .then(() => {

    /** Server */
    app.listen();

  })
  // .catch((e) =>
  //   console.error(
  //     "Could not connect to database! Check configs or connection.\n\n" + e
  //   )
  // );

export default {}