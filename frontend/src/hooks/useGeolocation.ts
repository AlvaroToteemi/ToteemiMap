import { useRef, useState } from "react"

export function useGeolocation() {
    const watchIdRef = useRef<number | null>(null)
    const [isTracking, setIsTracking] = useState(false)
    const [points, setPoints] = useState<number[][]>([])

    function start() {
        if (!navigator.geolocation) {
            alert("Geolocation not supported")
            return
        }

        setPoints([])

        watchIdRef.current = navigator.geolocation.watchPosition(
            (pos) => {
                const lat = pos.coords.latitude
                const lng = pos.coords.longitude

                setPoints(prev => [...prev, [lat, lng]])

                console.log("GPS:", lat, lng)
            },
            (err) => {
                console.error(err)
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000
            }
        )

        setIsTracking(true)
    }

    function stop() {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current)
        }

        setIsTracking(false)

        return points
    }

    return {
        start,
        stop,
        isTracking,
        points
    }
}