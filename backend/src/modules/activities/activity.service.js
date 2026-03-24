const { routeToCells } = require("../../shared/h3/routeToCells")
const { updateTerritories } = require("../territories/territory.service")
const pool = require("../../db")

async function processActivity(userId, points) {

    const cells = routeToCells(points)

    // 1. guardar actividad
    const activityRes = await pool.query(
        "INSERT INTO activities (user_id) VALUES ($1) RETURNING id",
        [userId]
    )

    const activityId = activityRes.rows[0].id

    // 2. guardar relación actividad-celdas
    for (const cell of cells) {
        await pool.query(
            "INSERT INTO activity_cells (activity_id, cell_id) VALUES ($1, $2)",
            [activityId, cell]
        )
    }

    // 3. actualizar territorios
    await updateTerritories(userId, cells)

    return {
        conquered: cells.length
    }
}

module.exports = { processActivity }