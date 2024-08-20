import * as EventService from "../services/event.service.js";
import express from "express";

const router = express.Router();

router.get("/:id/matches", async (req, res) => {
    const { id } = req.params;
    const { status } = req.query;

    EventService.listMatches({ id }, { status })
        .then((data) =>
            res.status(200).json({
                status: 200,
                data,
            })
        )
        .catch((err) => res.status(err.code).json(err));
});

export default router;
