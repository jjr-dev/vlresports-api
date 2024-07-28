import { getPage } from "./cheerio.helper.js"
import slug from "slug";

export function scrapeMatches() {
    return new Promise(async (resolve, reject) => {
        try {
            const $ = await getPage(`/Liquipedia:Matches`);

            const matches = [];

            $('.infobox_matches_content').each((i, element) => {
                const $match = $(element);

                const teams = [];

                ['left', 'right'].forEach((pos) => {
                    const $team = $match.find(`.team-${pos}`);

                    const hasTeam = $team.find('img').length > 0;

                    const $lightIcon = $team.find('.team-template-image-icon.team-template-lightmode');
                    const $darkIcon = $team.find('.team-template-image-icon.team-template-darkmode');

                    const score = $match.find(`.versus span:${(pos == 'left' ? 'first' : 'last')}-child`).text().trim();

                    const team = {
                        tag: hasTeam ? $team.find('.team-template-text a').text().trim() : "TBD",
                        title: hasTeam ? $lightIcon.find('img').attr('alt') : "TBD",
                        icons: {
                            light: hasTeam ? `${process.env.BASE_URL}${$lightIcon.find('img').attr('src')}` : false,
                            dark: hasTeam ? `${process.env.BASE_URL}${$darkIcon.find('img').attr('src')}` : false
                        },
                        score: score == "" ? 0 : parseInt(score)
                    }

                    teams.push(team)
                })

                const $tournament = $match.find('.tournament-flex');

                const timestamp = parseInt($match.find('.timer-object').attr('data-timestamp')) * 1000;

                const match = {
                    utc: new Date(timestamp).toUTCString(),
                    timestamp,
                    teams,
                    tournament: {
                        title: $tournament.find('img').attr('alt'),
                        icon: `${process.env.BASE_URL}${$tournament.find('img').attr('src')}`,
                        stage: $tournament.find('a').text().trim()
                    },
                    type: $match.find('.versus-lower abbr').text().trim()
                }

                match.__id = btoa(slug(`${timestamp} ${match.tournament.title} ${match.tournament.stage} ${teams[0].tag} ${teams[1].tag}`));

                if (matches.find((m) => m.__id == match.__id))
                    return;

                matches.push(match);
            })

            return resolve(matches);
        } catch (err) {
            return reject(err)
        }
    })
}