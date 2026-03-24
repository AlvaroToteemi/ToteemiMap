const express = require("express")
const { processActivity } = require("./activity.service")

const router = express.Router()

router.post("/activity", async (req, res) => {
    const { userId, points } = req.body

    if (!userId || !points) {
        return res.status(400).json({ error: "Missing data" })
    }

    const result = await processActivity(userId, points)

    res.json(result)
})

module.exports = router