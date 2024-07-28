import express from "express";
import MatchRouter from "./src/routers/match.router.js"
import dotenv from 'dotenv'
import * as CacheHelper from "./src/helpers/cache.helper.js"

dotenv.config();

const app = express();

app.use(express.json({ extends: false }));

app.use('/api/v1/matches', MatchRouter);

app.listen(process.env.PORT, () => console.log(`Hosted in ${process.env.PORT}`));

CacheHelper.init();

export default app;