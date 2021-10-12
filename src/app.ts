import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";

// import routes;
import routes from "./routes/lot.route";
import { validationErrors } from "./common/errors";


class App {
    // Initialize our express app
    private app: Express;
    public port: number;

    constructor(port: number) {
        this.port = port;
        this.app = express();

        /** Parse the request */
        this.app.use(express.urlencoded({extended: false}));

        /** Takes care of JSON data */
        this.app.use(express.json());

        /** Handle Cross Origin Requests */
        this.app.use(cors());

        /** Handle for common headers and vulnerabilities */
        this.app.use(helmet());

        /** Routes */
        this.app.use("/api/v1", routes);

        /** Error handling */
        // @ts-ignore
        this.app.use(validationErrors);

    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }

}

export default App;