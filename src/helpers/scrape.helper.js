import { getPage } from "./cheerio.helper.js";

export function scrapeMatches(query, results = false) {
    return new Promise(async (resolve, reject) => {
        try {
            const $ = await (query.event
                ? getPage(`event/matches/${query.event}`, {
                      series_id: "all",
                      group: "all",
                  })
                : getPage(`matches${results ? "/results" : ""}`, query));

            const matches = [];

            const eventTitle = query.event ? $(".event-desc .wf-title").text().trim() : false;

            $(".match-item").each((i, el) => {
                const $match = $(el);

                const $date = $match.closest(".wf-card").prev();
                $date.find(".wf-tag").remove();

                const date = new Date(`${$date.text().trim()} ${$match.find(".match-item-time").text().trim()}`);
                date.setHours(date.getHours() + parseInt(process.env.TIMEZONE ?? 0, 10));

                const [id, slug] = $match.attr("href").split("/").slice(-2);

                const $event = $match.find(".match-item-event");

                const matchEventTitle = $event.clone().children().remove().end().text().trim();

                const match = {
                    id,
                    slug,
                    timestamp: date.getTime(),
                    utc: date.toUTCString(),
                    status: $match.find(".ml-status").text().trim().toLowerCase(),
                    event: {
                        title: query.event ? eventTitle : matchEventTitle,
                        stage: query.event ? matchEventTitle : $event.find(".match-item-event-series").text().trim(),
                    },
                    teams: [],
                };

                $match.find(".match-item-vs-team").each((i, el) => {
                    const $team = $(el);

                    const score = parseInt($team.find(".match-item-vs-team-score").text().trim());

                    const team = {
                        title: $team
                            .find(".match-item-vs-team-name .text-of")
                            .clone()
                            .children()
                            .remove()
                            .end()
                            .text()
                            .trim(),
                        score: isNaN(score) ? 0 : score,
                        winner: $team.attr("class").split(" ").includes("mod-winner"),
                    };

                    match.teams.push(team);
                });

                matches.push(match);
            });

            return resolve(matches);
        } catch (err) {
            return reject(err);
        }
    });
}
