import { scrapeMatches } from "../helpers/scrape.helper.js"
import * as cache from "../helpers/cache.helper.js"

export function list(params) {
    return new Promise(async (resolve, reject) => {
        try {
            let matches = cache.find('matches', params, 30);

            if (!matches) {
                matches = await scrapeMatches(params);
                cache.save('matches', params, matches);
            }

            matches = matches.filter(match => {
                if (!params.tournaments)
                    return true;

                if (params.tournaments && params.tournaments.some(tournament => match.tournament.title.includes(tournament)))
                    return true;
            });

            matches = matches.sort((a, b) => a.timestamp - b.timestamp)

            return resolve(matches);
        } catch (err) {
            return reject(err)
        }
    })
}