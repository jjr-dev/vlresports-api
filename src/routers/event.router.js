import * as EventService from "../services/event.service.js";
import express from "express";

const router = express.Router()

router.get('/', async (req, res) => {
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
});

router.get('/:id/matches', (req, res) => {
    const { id } = req.params;
    const { series, status } = req.query;

    EventService.listMatches({ id, series, status })
        .then((data) => res.status(200).json({
            status: 200,
            data
        })).catch((err) => res.status(err.status).json(err));
})

router.get('/events/regions', (req, res) => {
    EventService.listRegions()
        .then((data) => res.status(200).json({
            status: 200,
            data
        })).catch((err) => res.status(err.status).json(err));
})

export default router;