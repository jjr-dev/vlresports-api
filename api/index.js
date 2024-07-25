
import express from "express";
import EventRouter from "./routers/event.router.js"

const api = express();
const port = 8080;

api.use(express.json({ extends: false }));

api.use('/api/events', EventRouter);

api.listen(port);