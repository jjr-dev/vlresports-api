import express from "express";
import MatchRouter from "./src/routers/match.router.js"
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json({ extends: false }));

app.use('/api/matches', MatchRouter);

app.listen(port);

export default app;