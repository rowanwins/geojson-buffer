import { degreesToRadians, radiansToDegrees } from './utils'

export function calculateBearing (point1, point2) {

    const lon1 = degreesToRadians(point1.x)
    const lon2 = degreesToRadians(point2.x)
    const lat1 = degreesToRadians(point1.y)
    const lat2 = degreesToRadians(point2.y)
    const a = Math.sin(lon2 - lon1) * Math.cos(lat2)
    const b = Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)

    return radiansToDegrees(Math.atan2(a, b))
}
