import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import compress from 'compression';
import Router from 'express-promise-router';
import { registerRoutes } from './routes';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
const defaultEnv = 'local';
const envPath = path.resolve(process.cwd(), `.env.${defaultEnv}`);
dotenv.config({ path: envPath });

const app: express.Express = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.hidePoweredBy());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(compress());

const router = Router();
app.use(router);
registerRoutes(router);

export default app;
