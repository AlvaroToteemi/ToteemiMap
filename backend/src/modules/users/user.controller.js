const express = require("express")
const pool = require("../../db")

const router = express.Router()

router.get("/api/users", async (req, res) => {
    const result = await pool.query("SELECT id, color FROM users")
    res.json(result.rows)
})

module.exports = router