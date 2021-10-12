import "reflect-metadata";
import {createConnection} from "typeorm";
import app from "./app";

createConnection().then(async connection => {

    /** Server */
    const PORT: any = process.env.PORT || 7000;
    app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));

}).catch(error => console.error("Could not connect to database! Check configs or connection."));
