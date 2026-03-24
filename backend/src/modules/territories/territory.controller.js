const express = require("express")
const {
    getTerritories,
    resetTerritories
} = require("./territory.service")

const router = express.Router()

router.get("/api/territories", async (req, res) => {
    res.json(await getTerritories())
})

router.post("/api/territories/reset", async (req, res) => {
    await resetTerritories()
    res.json({ ok: true })
})

module.exports = router