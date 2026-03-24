const API_URL = "https://crunchiest-lydia-costlier.ngrok-free.dev"

export async function fetchUsers() {
    const res = await fetch(`${API_URL}/users`, {
        headers: {
            "ngrok-skip-browser-warning": "true"
        }
    })

    if (!res.ok) {
        throw new Error("Error fetching users")
    }

    return res.json()
}