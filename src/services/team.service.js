import { scrapeTeam } from "../helpers/scrape.helper.js"
import * as cache from "../helpers/cache.helper.js"

export function find(params) {
    return new Promise(async (resolve) => {
        let team = cache.find('team', params, 10080);

        if (!team) {
            team = await scrapeTeam(params);
            cache.save('team', params, team);
        }

        return resolve(team);
    })
}