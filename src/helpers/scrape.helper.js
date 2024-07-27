import { getPage } from "./cheerio.helper.js"
import * as dateFns from 'date-fns'
import makeSlug from "slug";

export function scrapeEvents(data) {
    return new Promise(async (resolve) => {
        const $ = await getPage(`/events${(data?.region ? `/${data.region}` : '')}`, { page: data?.page ?? 1 });

        const events = {
            'ongoing': [],
            'upcoming': [],
            'completed': []
        };

        $(`.event-item`).each((i, element) => {
            const $event = $(element);

            const [id, slug] = $event.attr('href').split('/').slice(-2);

            const event = {
                id,
                title: $event.find('.event-item-title').text().trim(),
                slug,
                region: $event.find('.flag').attr('class').split(' ').slice(-1)[0].replace('mod-', ''),
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
    })
}

export function scrapeEventMatches(data) {
    return new Promise(async (resolve) => {
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

                const score = parseInt($team.find('.match-item-vs-team-score').text().trim());
                const title = $team.find('.match-item-vs-team-name .text-of').clone().children().remove().end().text().trim();

                const team = {
                    title,
                    slug: makeSlug(title),
                    score: !isNaN(score) ? score : 0,
                    winner: $team.attr('class').split(' ').includes('mod-winner')
                }

                match.teams.push(team);
            });

            matches.push(match);
        })

        resolve(matches);
    })
}

export function scrapeEventRegions() {
    return new Promise(async (resolve) => {
        const $ = await getPage(`/events`);

        const regions = [];

        $('.mod-header .wf-nav-item').each((i, element) => {
            const $region = $(element);

            const title = $region.find('.normal').text().trim();

            const region = {
                title,
                short: $region.find('.small').text().trim(),
                slug: makeSlug(title)
            }

            regions.push(region);
        })

        resolve(regions);
    })
}

export function scrapeTeam(data) {
    return new Promise(async (resolve) => {
        const $ = await getPage(`/team/${data.id}`);

        const $header = $('.team-header');

        const title = $header.find('.team-header-name h1').text().trim();

        const team = {
            id: data.id,
            title,
            slug: makeSlug(title),
            tag: $header.find('.team-header-name h2').text().trim(),
            icon: `https:${$header.find('.team-header-logo img').attr('src')}`,
            region: $header.find('.team-header-country .flag').attr('class').split(' ').slice(-1)[0].replace('mod-', '')
        };

        resolve(team);
    })
}