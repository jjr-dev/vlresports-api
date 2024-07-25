import { scrapeEvents, scrapeEventMatches, scrapeEventRegions } from "../helpers/scrape.helper.js";
import * as cache from "../helpers/cache.helper.js"

export function list(params) {
    return new Promise(async (resolve, reject) => {
        let events = cache.find('events', params, 10);

        if (!events) {
            events = await scrapeEvents(params).catch((err) => reject(err));
            cache.save('events', params, events);
        }

        return resolve(events);
    })
}

export async function listMatches(params) {
    return new Promise(async (resolve, reject) => {
        let matches = cache.find('event_matches', params, 10);

        if (!matches) {
            matches = await scrapeEventMatches(params).catch((err) => reject(err));
            cache.save('event_matches', params, matches);
        }

        return resolve(matches);
    })
}

export async function listRegions() {
    return new Promise(async (resolve, reject) => {
        let regions = cache.find('event_regions', {}, 1440);

        if (!regions) {
            regions = await scrapeEventRegions().catch((err) => reject(err));
            cache.save('event_regions', {}, regions);
        }

        return resolve(regions);
    })
}