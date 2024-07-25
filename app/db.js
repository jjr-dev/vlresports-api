import { JSONFilePreset } from "lowdb/node";
import { randomUUID } from "crypto";

const db = await JSONFilePreset('app/db.json', { teams: [], caches: [] });
db.randomUUID = randomUUID;

db.find = (collection, key, value) => {
    return db.data[collection].find((item) => item[key] == value);
}

db.findIndex = (collection, key, value) => {
    return db.data[collection].findIndex((item) => item[key] == value);
}

export default db;