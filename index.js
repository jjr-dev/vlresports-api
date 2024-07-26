import express from "express";
import EventRouter from "./src/routers/event.router.js"

const app = express();
const port = 3000;

app.use(express.json({ extends: false }));

app.get("/", (req, res) => res.send("Express on Vercel"));

app.use('/api/events', EventRouter);

app.listen(port);

export default app;