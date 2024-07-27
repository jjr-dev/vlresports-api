import * as MatchService from "../services/match.service.js"
import express from "express";

const router = express.Router()

router.get('/', async (req, res) => {
    const { tournaments } = req.query;

    MatchService.list({ tournaments })
        .then((data) => res.status(200).json({
            status: 200,
            data
        })).catch((err) => res.status(err.code).json(err));
});

export default router;