import * as TeamService from "../services/team.service.js"
import express from "express"

const router = express.Router()

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    TeamService.find({ id })
        .then((data) => res.status(200).json({
            status: 200,
            data
        })).catch((err) => res.status(err.code).json(err));
});

export default router;