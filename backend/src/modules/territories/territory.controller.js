const express = require("express")
const {
    getTerritories,
    resetTerritories
} = require("./territory.service")

const router = express.Router()

router.get("/", async (req, res) => {
    res.json(await getTerritories())
})

router.post("/reset", async (req, res) => {
    await resetTerritories()
    res.json({ ok: true })
})

module.exports = router