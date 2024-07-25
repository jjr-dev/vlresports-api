import * as EventService from "./services/event.service.js";

export default function router(app) {
    app.get('/events', async (req, res) => {
        const { page, region } = req.query;

        if (region) {
            const regions = await EventService.listRegions();

            if (!regions.find((item) => item.slug == region))
                return res.status(400).json({
                    status: 400,
                    message: "Region not found"
                })
        }

        EventService.list({ page, region })
            .then((data) => res.status(200).json({
                status: 200,
                data
            })).catch((err) => res.status(err.status).json(err));
    })

    app.get('/events/:id/matches', (req, res) => {
        const { id } = req.params;
        const { series, status } = req.query;

        EventService.listMatches({ id, series, status })
            .then((data) => res.status(200).json({
                status: 200,
                data
            })).catch((err) => res.status(err.status).json(err));
    })

    app.get('/events/regions', (req, res) => {
        EventService.listRegions()
            .then((data) => res.status(200).json({
                status: 200,
                data
            })).catch((err) => res.status(err.status).json(err));
    })
}