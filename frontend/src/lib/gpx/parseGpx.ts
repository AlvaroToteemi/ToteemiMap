export function parseGpx(text: string): number[][] {
    const parser = new DOMParser()
    const xml = parser.parseFromString(text, "application/xml")

    const trackpoints = xml.getElementsByTagName("trkpt")

    const points: number[][] = []

    for (let i = 0; i < trackpoints.length; i++) {
        const lat = parseFloat(trackpoints[i].getAttribute("lat")!)
        const lon = parseFloat(trackpoints[i].getAttribute("lon")!)

        points.push([lat, lon])
    }

    return points
}