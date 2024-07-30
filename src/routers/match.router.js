import * as MatchService from "../services/match.service.js"
import express from "express";

const router = express.Router()

router.get('/', async (req, res) => {
    const { events } = req.query;
    const { page } = req.query;

    MatchService.list({ page: page ?? '1' }, { events })
        .then((data) => res.status(200).json({
            status: 200,
            data
        })).catch((err) => res.status(err.code).json(err));
});

router.get('/results', async (req, res) => {
    const { events } = req.query;
    const { page } = req.query;

    MatchService.list({ page: page ?? '1' }, { events, results: true })
        .then((data) => res.status(200).json({
            status: 200,
            data
        })).catch((err) => res.status(err.code).json(err));
});

export default router;