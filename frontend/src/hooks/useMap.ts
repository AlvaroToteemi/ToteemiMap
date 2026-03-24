import maplibregl from "maplibre-gl"
import { polygonToCells, cellToBoundary } from "h3-js"

export function createMap(container: string) {

    const map = new maplibregl.Map({
        container,
        style: "https://tiles.openfreemap.org/styles/liberty",
        center: [-3.7038, 40.4168],
        zoom: 13
    })

    return map
}

export function updateHexagons(map: maplibregl.Map, ownedCells: Map<string, string>, users: any[]) {

    if (map.getZoom() < 11) {
        const source = map.getSource("hexagons") as maplibregl.GeoJSONSource
        if (source) {
            source.setData({ type: "FeatureCollection", features: [] })
        }
        return
    }

    const bounds = map.getBounds()

    const polygon = [[
        [bounds.getSouth(), bounds.getWest()],
        [bounds.getSouth(), bounds.getEast()],
        [bounds.getNorth(), bounds.getEast()],
        [bounds.getNorth(), bounds.getWest()],
        [bounds.getSouth(), bounds.getWest()]
    ]]

    const cells = polygonToCells(polygon, 9)

    const features = cells.map(cell => {
        const boundary = cellToBoundary(cell)

        const ownerId = ownedCells.get(cell)
        const user = users.find(u => u.id === ownerId)

        return {
            type: "Feature" as const,
            geometry: {
                type: "Polygon" as const,
                coordinates: [[
                    ...boundary.map(([lat, lng]) => [lng, lat]),
                    [boundary[0][1], boundary[0][0]]
                ]]
            },
            properties: {
                cell,
                owner: user ? user.color : null
            }
        }
    })

    const source = map.getSource("hexagons") as maplibregl.GeoJSONSource

    source.setData({
        type: "FeatureCollection" as const,
        features
    })
}

export function drawLiveRoute(map: maplibregl.Map, points: number[][]) {
    const features = [{
        type: "Feature" as const,
        properties: {},
        geometry: {
            type: "LineString" as const,
            coordinates: points.map(([lat, lng]) => [lng, lat])
        }
    }]

    const source = map.getSource("live-route") as maplibregl.GeoJSONSource

    if (source) {
        source.setData({
            type: "FeatureCollection" as const,
            features
        })
    }
}