import { useEffect, useRef, useState } from "react"
import "maplibre-gl/dist/maplibre-gl.css"

import { createMap, updateHexagons } from "../../hooks/useMap"
import { useTerritories } from "../../features/territories/useTerritories"
import { parseGpx } from "../../lib/gpx/parseGpx"
import { fetchUsers } from "../../features/users/userApi"
import UserSelector from "./UserSelector"
import { useGeolocation } from "../../hooks/useGeolocation"
import TrackingControls from "./TrackingControls"
import { drawLiveRoute } from "../../hooks/useMap"

export default function MapView() {

    const mapRef = useRef<any>(null)
    //const inputRef = useRef<HTMLInputElement>(null)
    const [users, setUsers] = useState<any[]>([])
    const usersRef = useRef<any[]>([])
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)

    const { ownedCellsRef, loadTerritories, addActivity } = useTerritories()
    const { start, stop, isTracking, points } = useGeolocation()

    useEffect(() => {
        usersRef.current = users
    }, [users])

    useEffect(() => {
        if (!mapRef.current) return
        if (!isTracking) return

        drawLiveRoute(mapRef.current, points)

    }, [points, isTracking])

    useEffect(() => {
        const map = createMap("map")
        mapRef.current = map

        map.on("load", async () => {
            const usersData = await fetchUsers()
            setUsers(usersData)

            map.addSource("hexagons", {
                type: "geojson",
                data: { type: "FeatureCollection" as const, features: [] }
            })

            map.addLayer({
                id: "hex-layer",
                type: "fill",
                source: "hexagons",
                paint: {
                    "fill-color": ["get", "owner"],
                    "fill-opacity": 0.25
                }
            })

            map.addSource("live-route", {
                type: "geojson",
                data: {
                    type: "FeatureCollection" as const,
                    features: []
                }
            })

            map.addLayer({
                id: "live-route-layer",
                type: "line",
                source: "live-route",
                paint: {
                    "line-color": "#ff8800",
                    "line-width": 4
                }
            })

            await loadTerritories()
            updateHexagons(map, ownedCellsRef.current, usersData)
        })

        map.on("moveend", () => {
            updateHexagons(map, ownedCellsRef.current, usersRef.current)
        })



        return () => map.remove()
    }, [])

    function handleUserChange(userId: string) {
        setCurrentUserId(userId)
    }

    async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const userId = currentUserId

        if (!userId) {
            alert("Selecciona un usuario")
            return
        }

        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()

        reader.onload = async (e) => {
            const text = e.target?.result as string
            const points = parseGpx(text)

            await addActivity(userId, points)

            if (mapRef.current) {
                updateHexagons(mapRef.current, ownedCellsRef.current, usersRef.current)
            }
        }

        reader.readAsText(file)
    }
    function handleStart() {
        if (!currentUserId) {
            alert("Selecciona usuario")
            return
        }

        start()
    }

    async function handleStop() {
        const points = stop()

        console.log("STOP - points:", points)

        if (!points || points.length === 0) return

        await addActivity(currentUserId!, points)
        console.log("ACTIVITY SENT")

        await loadTerritories()
        console.log("TERRITORIES LOADED", ownedCellsRef.current)

        if (mapRef.current) {
            updateHexagons(mapRef.current, ownedCellsRef.current, usersRef.current)
            console.log("HEXAGONS UPDATED")
        }
    }

    return (
        <>
            <UserSelector
                users={users}
                currentUserId={currentUserId}
                onChange={handleUserChange}
            />
            <TrackingControls
                isTracking={isTracking}
                onStart={handleStart}
                onStop={handleStop}
            />

            <input type="file" onChange={handleFileChange} />
            <div id="map" style={{ width: "100%", height: "100vh" }} />
        </>
    )
}