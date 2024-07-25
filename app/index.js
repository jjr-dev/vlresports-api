
import express from "express";
import router from "./router.js"

const api = express();
const port = 3000;

api.use(express.json());

api.listen(port);

router(api);

// scrapeEvents({
//     page: 1,
//     region: 'all'
// });

// scrapeEventMatches('2089', {
//     stage: 'all',
//     status: 'completed'
// })