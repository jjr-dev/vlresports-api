import { scrapeMatches } from "../helpers/scrape.helper.js";
import * as CacheHelper from "../helpers/cache.helper.js";

export function list(query = {}, filter = {}) {
    return new Promise(async (resolve, reject) => {
        try {
            const type = filter.results ? "matches_results" : "matches";

            let matches = CacheHelper.get(type, query);

            if (!matches) {
                matches = await scrapeMatches(query, filter.results);
                CacheHelper.set(type, matches, 600, query);
            }

            matches = matches.filter((match) => {
                if (!filter.events) return true;
                if (filter.events && filter.events.some((event) => match.event.title.includes(event))) return true;
            });

            matches = matches.sort((a, b) => a.timestamp - b.timestamp);

            return resolve(matches);
        } catch (err) {
            console.log(err);
            return reject(err);
        }
    });
}
