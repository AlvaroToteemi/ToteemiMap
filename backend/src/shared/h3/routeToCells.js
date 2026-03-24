const { latLngToCell } = require("h3-js")

function routeToCells(points) {
    const cells = new Set()

    for (let i = 0; i < points.length - 1; i++) {

        const [lat1, lng1] = points[i]
        const [lat2, lng2] = points[i + 1]

        const steps = 10

        for (let j = 0; j <= steps; j++) {
            const lat = lat1 + (lat2 - lat1) * (j / steps)
            const lng = lng1 + (lng2 - lng1) * (j / steps)

            const cell = latLngToCell(lat, lng, 9)
            cells.add(cell)
        }
    }

    return Array.from(cells)
}

module.exports = { routeToCells }