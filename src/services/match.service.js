import { scrapeMatches } from "../helpers/scrape.helper.js"
import * as CacheHelper from "../helpers/cache.helper.js"

export function list(params) {
    return new Promise(async (resolve, reject) => {
        try {
            let matches = CacheHelper.find('matches');

            if (!matches) {
                matches = await scrapeMatches(params);
                CacheHelper.save('matches', matches, 10);
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
            console.log(err);
            return reject(err)
        }
    })
}