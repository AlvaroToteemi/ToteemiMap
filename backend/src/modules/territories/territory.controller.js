const express = require("express")
const {
    getTerritories,
    resetTerritories
} = require("./territory.service")

const router = express.Router()

router.get("/territories", async (req, res) => {
    res.json(await getTerritories())
})

router.post("/territories/reset", async (req, res) => {
    await resetTerritories()
    res.json({ ok: true })
})

module.exports = router