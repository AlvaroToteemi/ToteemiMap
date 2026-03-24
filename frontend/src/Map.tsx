// import { useEffect, useRef } from "react"
// import maplibregl from "maplibre-gl"
// import "maplibre-gl/dist/maplibre-gl.css"
// import { polygonToCells, cellToBoundary } from "h3-js"



// export default function MapView() {

//     const ownedCellsRef = useRef<Map<string, string>>(new Map())
//     const routesRef = useRef<number[][][]>([])
//     const currentUserRef = useRef(0)
//     const users = [
//         { id: "user1", color: "#ff0000" },
//         { id: "user2", color: "#0000ff" },
//         { id: "user3", color: "#00aa00" }
//     ]

//     const inputRef = useRef<HTMLInputElement>(null)
//     useEffect(() => {

//         const input = inputRef.current

//         if (input) {
//             input.onchange = (event: any) => {

//                 const user = users[currentUserRef.current % users.length]
//                 currentUserRef.current++

//                 const file = event.target.files[0]
//                 if (!file) return

//                 const reader = new FileReader()

//                 reader.onload = async (e) => {

//                     const text = e.target?.result as string

//                     const parser = new DOMParser()
//                     const xml = parser.parseFromString(text, "application/xml")

//                     const trackpoints = xml.getElementsByTagName("trkpt")

//                     const points: number[][] = []

//                     for (let i = 0; i < trackpoints.length; i++) {
//                         const lat = parseFloat(trackpoints[i].getAttribute("lat")!)
//                         const lon = parseFloat(trackpoints[i].getAttribute("lon")!)

//                         points.push([lat, lon])
//                     }

//                     console.log("Puntos GPX:", points.length)

//                     await fetch("http://localhost:3000/activity", {
//                         method: "POST",
//                         headers: {
//                             "Content-Type": "application/json"
//                         },
//                         body: JSON.stringify({
//                             userId: user.id,
//                             points
//                         })
//                     })
//                     await loadTerritories()
//                     drawRoute(points)

//                 }

//                 reader.readAsText(file)
//             }
//         }

//         const map = new maplibregl.Map({
//             container: "map",
//             style: "https://tiles.openfreemap.org/styles/liberty",
//             center: [-3.7038, 40.4168],
//             zoom: 13
//         })

//         async function loadTerritories() {

//             const res = await fetch("http://localhost:3000/territories")
//             const data = await res.json()

//             ownedCellsRef.current.clear()

//             data.forEach((t: any) => {
//                 ownedCellsRef.current.set(t.cell, t.owner)
//             })

//             updateHexagons()
//         }

//         function updateHexagons() {
//             if (map.getZoom() < 11) {
//                 const source = map.getSource("hexagons") as maplibregl.GeoJSONSource
//                 if (source) {
//                     source.setData({
//                         type: "FeatureCollection" as const,
//                         features: []
//                     })
//                 }
//                 return
//             }
//             const bounds = map.getBounds()

//             // H3 espera [lat, lng]
//             const polygon = [[
//                 [bounds.getSouth(), bounds.getWest()],
//                 [bounds.getSouth(), bounds.getEast()],
//                 [bounds.getNorth(), bounds.getEast()],
//                 [bounds.getNorth(), bounds.getWest()],
//                 [bounds.getSouth(), bounds.getWest()]
//             ]]

//             const cells = polygonToCells(polygon, 9)

//             const features = cells.map(cell => {

//                 const boundary = cellToBoundary(cell)

//                 const ownerId = ownedCellsRef.current.get(cell)
//                 const user = users.find(u => u.id === ownerId)

//                 return {
//                     type: "Feature" as const,
//                     geometry: {
//                         type: "Polygon" as const,
//                         coordinates: [[
//                             ...boundary.map(([lat, lng]) => [lng, lat]),
//                             [boundary[0][1], boundary[0][0]]
//                         ]]
//                     },
//                     properties: {
//                         cell,
//                         owner: user ? user.color : null
//                     }
//                 }

//             })

//             const geojson = {
//                 type: "FeatureCollection" as const,
//                 features
//             }

//             const source = map.getSource("hexagons") as maplibregl.GeoJSONSource

//             if (source) {
//                 source.setData(geojson)
//             }

//         }
//         // function conquerRoute(route: number[][], userId: string) {

//         //     const cells = new Set<string>()

//         //     for (let i = 0; i < route.length - 1; i++) {

//         //         const [lat1, lng1] = route[i]
//         //         const [lat2, lng2] = route[i + 1]

//         //         // interpolar puntos intermedios
//         //         const steps = 10

//         //         for (let j = 0; j <= steps; j++) {

//         //             const lat = lat1 + (lat2 - lat1) * (j / steps)
//         //             const lng = lng1 + (lng2 - lng1) * (j / steps)

//         //             const cell = latLngToCell(lat, lng, 9)
//         //             cells.add(cell)
//         //         }
//         //     }

//         //     cells.forEach(cell => ownedCellsRef.current.set(cell, userId))

//         //     updateHexagons()
//         // }
//         function drawRoute(route: number[][]) {

//             routesRef.current.push(route)

//             const features = routesRef.current.map(r => ({
//                 type: "Feature" as const,
//                 properties: {},
//                 geometry: {
//                     type: "LineString" as const,
//                     coordinates: r.map(([lat, lng]) => [lng, lat])
//                 }
//             }))

//             const geojson = {
//                 type: "FeatureCollection" as const,
//                 features
//             }

//             const source = map.getSource("route") as maplibregl.GeoJSONSource

//             if (source) {
//                 source.setData(geojson)
//             }
//         }
//         let moveTimeout: any
//         map.on("load", () => {
//             map.addSource("hexagons", {
//                 type: "geojson",
//                 data: {
//                     type: "FeatureCollection" as const,
//                     features: []
//                 }
//             })
//             map.addLayer({
//                 id: "hex-layer",
//                 type: "fill",
//                 source: "hexagons",
//                 paint: {
//                     "fill-color": [
//                         "case",
//                         ["has", "owner"],
//                         ["get", "owner"],
//                         "#cccccc"
//                     ],
//                     "fill-opacity": 0.25
//                 }
//             })
//             map.on("click", "hex-layer", (e) => {

//                 const features = map.queryRenderedFeatures(e.point, {
//                     layers: ["hex-layer"]
//                 })

//                 if (!features.length) return

//                 const feature = features[0]
//                 const cell = feature.properties?.cell

//                 if (!cell) return

//                 // añadir a conquistados
//                 const user = users[currentUserRef.current % users.length]
//                 ownedCellsRef.current.set(cell, user.id)

//                 updateHexagons()

//             })
//             map.addSource("route", {
//                 type: "geojson",
//                 data: {
//                     type: "FeatureCollection" as const,
//                     features: []
//                 }
//             })

//             map.addLayer({
//                 id: "route-layer",
//                 type: "line",
//                 source: "route",
//                 paint: {
//                     "line-color": "#5a8bedff",
//                     "line-width": 3
//                 }
//             })
//             updateHexagons()
//             loadTerritories()
//         })

//         map.on("moveend", () => {
//             clearTimeout(moveTimeout)
//             moveTimeout = setTimeout(updateHexagons, 200)
//         })

//         return () => map.remove()

//     }, [])

//     return (
//         <>
//             <input type="file" ref={inputRef} />
//             <div id="map" style={{ width: "100%", height: "100vh" }} />
//         </>
//     )

// }