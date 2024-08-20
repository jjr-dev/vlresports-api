import { scrapeMatches } from "../helpers/scrape.helper.js";
import * as CacheHelper from "../helpers/cache.helper.js";

export function listMatches(query = {}, filter = {}) {
    return new Promise(async (resolve, reject) => {
        try {
            const type = "event_matches";

            let matches = CacheHelper.get(type, query);

            if (!matches) {
                matches = await scrapeMatches({ event: query.id });
                CacheHelper.set(type, matches, 600, query);
            }

            matches = matches.filter((match) => {
                if (!filter.status) return true;
                if (filter.status && filter.status.some((status) => match.status == status)) return true;
            });

            matches = matches.sort((a, b) => a.timestamp - b.timestamp);

            return resolve(matches);
        } catch (err) {
            console.log(err);
            return reject(err);
        }
    });
}
