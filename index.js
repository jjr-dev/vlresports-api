import express from "express";
import EventRouter from "./src/routers/event.router.js"
import TeamRouter from "./src/routers/team.router.js"

const app = express();
const port = 3000;

app.use(express.json({ extends: false }));

app.use('/api/events', EventRouter);
app.use('/api/teams', TeamRouter);

app.listen(port);

export default app;