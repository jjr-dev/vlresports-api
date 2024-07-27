import { scrapeEvents, scrapeEventMatches, scrapeEventRegions } from "../helpers/scrape.helper.js"
import * as cache from "../helpers/cache.helper.js"
import * as TeamService from "../services/team.service.js"

export function list(params) {
    return new Promise(async (resolve) => {
        let events = cache.find('events', params, 10);

        if (!events) {
            events = await scrapeEvents(params);
            cache.save('events', params, events);
        }

        return resolve(events);
    })
}

export async function listMatches(params) {
    return new Promise(async (resolve) => {
        let matches = cache.find('event_matches', params, 10);

        if (!matches) {
            matches = await scrapeEventMatches(params)

            matches.forEach((match, i) => {
                match.teams.forEach(async (t, ii) => {
                    if (t.slug === 'tbd') return;

                    const team = await TeamService.findBySlug(t.slug).catch(() => { })

                    if (!team)
                        return;

                    matches[i].teams[ii] = {
                        ...t,
                        ...team
                    }
                })
            })

            cache.save('event_matches', params, matches);
        }

        return resolve(matches);
    })
}

export async function listRegions() {
    return new Promise(async (resolve) => {
        let regions = cache.find('event_regions', {}, 1440);

        if (!regions) {
            regions = await scrapeEventRegions();
            cache.save('event_regions', {}, regions);
        }

        return resolve(regions);
    })
}