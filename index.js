import express from "express";
import cors from "cors";
import MatchRouter from "./src/routers/match.router.js"
import dotenv from 'dotenv'
import * as CacheHelper from "./src/helpers/cache.helper.js"

dotenv.config();

const port = 8080;

const app = express();

app.use(cors());

app.use(express.json({ extends: false }));

app.use('/api/v1/matches', MatchRouter);

app.listen(port, () => console.log(`Hosted in ${port}`));

CacheHelper.init();

export default app;