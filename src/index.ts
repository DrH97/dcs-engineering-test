import "reflect-metadata";
import { createConnection } from "typeorm";
import App from "./app";
import { logger } from "./common/utils";

import dotenv from 'dotenv';
dotenv.config();

const PORT: any = process.env.PORT || 3000;

const app = new App(PORT);


import cluster from "cluster"
import { cpus } from 'os';
const totalAvailableCores = cpus().length;
const concurrencyLevel = process.env.WEB_CONCURRENCY_CORES || totalAvailableCores;

const start = () => {

  createConnection()
    .then(() => {
      /** Server */
      app.listen();
    })
    .catch((e) => {
      logger(e);
      console.log("Could not connect to database! Check configs or connection.");
    });


};

if (cluster.isMaster) {
  console.log(`Number of Cores available is ${totalAvailableCores}`);
  console.log(`Number of Cores to use ${concurrencyLevel}`);
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < concurrencyLevel; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });

} else {
  start();
}