import { useRef } from "react"
import { fetchTerritories, sendActivity } from "./territoryApi"

export function useTerritories() {

    const ownedCellsRef = useRef<Map<string, string>>(new Map())

    async function loadTerritories() {
        const data = await fetchTerritories()

        ownedCellsRef.current.clear()

        data.forEach((t: any) => {
            ownedCellsRef.current.set(t.cell, t.owner)
        })
    }

    async function addActivity(userId: string, points: number[][]) {
        await sendActivity(userId, points)
        await loadTerritories()
    }

    return {
        ownedCellsRef,
        loadTerritories,
        addActivity
    }
}