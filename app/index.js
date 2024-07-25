
import express from "express";
import router from "./router.js"

const app = express();
const port = 3000;

app.use(express.json());

app.listen(port);

router(app);

// scrapeEvents({
//     page: 1,
//     region: 'all'
// });

// scrapeEventMatches('2089', {
//     stage: 'all',
//     status: 'completed'
// })