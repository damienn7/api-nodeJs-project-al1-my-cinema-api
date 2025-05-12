// for test
// console.log("Hello world !");
import express from 'express';
import { initHandlers } from './handlers/handler';
import { AppDataSource } from './db/database';
import bodyParser from 'body-parser';
import "dotenv/config";
const app = async () => {
    const app = express();
    const port = 3000;
    app.use(express.json());
    app.use(bodyParser.json({ limit: '50mb' , type: 'application/*+json' }))

    initHandlers(app);

    try {
        await AppDataSource.initialize();
    } catch (error) {
        console.error('DB error : ',error);
    }

    app.listen(port, () => {
        console.log(`Server is listening on http://localhost:${port}`)
    });
}

app()