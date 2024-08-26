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
            const eventIcon = query.event ? $(".event-header-thumb img").attr("src") : false;

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
                        icon: query.event ? eventIcon : $match.find(".match-item-icon img").attr("src"),
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

export function scrapeMatch(query) {
    return new Promise(async (resolve, reject) => {
        try {
            const $ = await getPage(`${query.match}`);

            const $event = $(".match-header-event");

            const match = {
                id: query.match,
                event: {
                    title: $event.find("div div:not(.match-header-event-series)").text().trim(),
                    stage: $event.find("div .match-header-event-series").text().trim(),
                    icon: $event.find("img").attr("src"),
                },
                teams: [],
                vods: [],
                streams: [],
            };

            $(".match-header-vs .match-header-link").each((i, el) => {
                const $team = $(el);

                const [id, slug] = $team.attr("href").split("/").slice(-2);

                match.teams.push({
                    id,
                    slug,
                    title: $team.find(".match-header-link-name .wf-title-med").text().trim(),
                    icon: $team.find("img").attr("src"),
                });
            });

            $(".match-header-vs-score span").each((i, el) => {
                if (i == 1) return;

                const $score = $(el);

                const score = parseInt($score.text().trim());

                const index = i > 0 ? i - 1 : i;

                match.teams[index] = {
                    ...match.teams[index],
                    score: isNaN(score) ? 0 : score,
                    winner: $score.attr("class").split(" ").includes("match-header-vs-score-winner"),
                };
            });

            $(".match-streams .match-streams-container .match-streams-btn:not(.mod-expand)").each((i, el) => {
                const $stream = $(el);

                match.streams.push({
                    title: $stream.find("span").text().trim(),
                    url: $stream.find(".match-streams-btn-external").attr("href"),
                });
            });

            $(".match-vods .match-streams-container a").each((i, el) => {
                const $vod = $(el);

                match.vods.push({
                    title: $vod.text().trim(),
                    url: $vod.attr("href"),
                });
            });

            return resolve(match);
        } catch (err) {
            return reject(err);
        }
    });
}
