const API_URL = "https://crunchiest-lydia-costlier.ngrok-free.dev"

export async function sendActivity(userId: string, points: number[][]) {
    const res = await fetch(`${API_URL}/activity`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId, points })
    })

    if (!res.ok) {
        throw new Error("Error sending activity")
    }

    return res.json()
}

export async function fetchTerritories() {
    const res = await fetch(`${API_URL}/territories`)

    if (!res.ok) {
        throw new Error("Error fetching territories")
    }

    return res.json()
}