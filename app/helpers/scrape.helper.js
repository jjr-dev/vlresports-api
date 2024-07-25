import { getPage } from "./cheerio.helper.js";
import * as dateFns from 'date-fns'
import slug from "slug";

export function scrapeEvents(data) {
    return new Promise(async (resolve, reject) => {
        try {
            const $ = await getPage(`/events${(data?.region ? `/${data.region}` : '')}`, { page: data?.page ?? 1 });

            const events = {
                'ongoing': [],
                'upcoming': [],
                'completed': []
            };

            $(`.event-item`).each((i, element) => {
                const $event = $(element);
                const $flag = $event.find('.flag')

                const [id, slug] = $event.attr('href').split('/').slice(-2);

                const event = {
                    id,
                    title: $event.find('.event-item-title').text().trim(),
                    slug,
                    region: $flag.attr('class').split(' ').slice(-1)[0].replace('mod-', ''),
                    icon: `https:${$event.find('.event-item-thumb img').attr('src')}`,
                    status: $event.find('.event-item-desc-item-status').text().trim(),
                    prize: $event.find('.mod-prize').clone().children().remove().end().text().trim(),
                    date: $event.find('.mod-dates').clone().children().remove().end().text().trim()
                }

                if (!events[event.status])
                    events[event.status] = [];

                events[event.status].push(event);
            })

            resolve(events);
        } catch (err) {
            reject(err);
        }
    })
}

export function scrapeEventMatches(data) {
    return new Promise(async (resolve, reject) => {
        try {
            const $ = await getPage(`/event/matches/${data.id}`, {
                series_id: data?.series,
                group: data?.status
            });

            const matches = [];

            $(`.match-item`).each((i, element) => {
                const $match = $(element);
                const $event = $match.find('.match-item-event');

                const [id, slug] = $match.attr('href').split('/').slice(-2);

                const match = {
                    id,
                    slug,
                    date: dateFns.parse(`${$match.closest('.wf-card').prev('.wf-label.mod-large').clone().find('.wf-tag').remove().end().text().trim()} ${$match.find('.match-item-time').text().trim()}`, 'EEE, MMMM d, yyyy hh:mm a', new Date()),
                    status: $match.find('.ml-status').text().trim().toLowerCase(),
                    series: $event.find('.match-item-event-series').text().trim(),
                    stage: $event.clone().children().remove().end().text().trim(),
                    teams: []
                };

                $match.find('.match-item-vs-team').each((i, element) => {
                    const $team = $(element);

                    const team = {
                        name: $team.find('.match-item-vs-team-name .text-of').clone().children().remove().end().text().trim(),
                        score: parseInt($team.find('.match-item-vs-team-score').text().trim()),
                        winner: $team.attr('class').split(' ').includes('mod-winner')
                    }

                    match.teams.push(team);
                });

                console.log(match);

                matches.push(match);
            })

            resolve(matches);
        } catch (err) {
            reject(err);
        }
    })
}

export function scrapeEventRegions() {
    return new Promise(async (resolve, reject) => {
        try {
            const $ = await getPage(`/events`);

            const regions = [];

            $('.mod-header .wf-nav-item').each((i, element) => {
                const $region = $(element);

                const name = $region.find('.normal').text().trim();

                const region = {
                    name,
                    short: $region.find('.small').text().trim(),
                    slug: slug(name)
                }

                regions.push(region);
            })

            resolve(regions);
        } catch (err) {
            reject(err);
        }
    })
}