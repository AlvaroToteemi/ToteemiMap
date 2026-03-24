const pool = require("../../db")

async function updateTerritories(userId, cells) {
    for (const cell of cells) {
        await pool.query(
            `
            INSERT INTO territories (cell_id, owner_user_id)
            VALUES ($1, $2)
            ON CONFLICT (cell_id)
            DO UPDATE SET owner_user_id = $2, updated_at = NOW()
            `,
            [cell, userId]
        )
    }
}

async function getTerritories() {
    const res = await pool.query(
        "SELECT cell_id, owner_user_id FROM territories"
    )

    return res.rows.map(row => ({
        cell: row.cell_id,
        owner: row.owner_user_id
    }))
}

async function resetTerritories() {
    await pool.query("DELETE FROM territories")
}

module.exports = {
    updateTerritories,
    getTerritories,
    resetTerritories
}