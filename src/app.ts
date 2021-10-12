import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";


// Initialize our express app
const app: Express = express();

/** Parse the request */
app.use(express.urlencoded({ extended: false }));

/** Takes care of JSON data */
app.use(express.json());

/** Handle Cross Origin Requests */
app.use(cors());

/** Handle for common headers and vulnerabilities */
app.use(helmet());


/** Routes */
app.use('/', (req, res, next) => {
    res.status(200).send("it works");
});

// Export app to run after db connection and for easier testing
export default app;