import express from 'express';
import { initHandlers } from './handlers/handler';
import bodyParser from 'body-parser';
import 'dotenv/config';

const app = express();

app.use(express.json());
app.use(bodyParser.json({ limit: '50mb', type: 'application/*+json' }));

initHandlers(app);

export { app };