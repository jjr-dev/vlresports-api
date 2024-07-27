import { JSONFilePreset } from "lowdb/node";
import { randomUUID } from "crypto";

const db = await JSONFilePreset('./db.json', { teams: [], caches: [] });
db.randomUUID = randomUUID;

export default db;