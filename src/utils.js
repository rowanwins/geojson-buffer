import Point from './Point'

export function offsetEdge (point1, point2, offset) {
    var L = Math.sqrt((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y))

    var out1x = point1.x + offset * (point2.y - point1.y) / L
    var out2x = point2.x + offset * (point2.y - point1.y) / L
    var out1y = point1.y + offset * (point1.x - point2.x) / L
    var out2y = point2.y + offset * (point1.x - point2.x) / L
    return [[out1x, out1y], [out2x, out2y]]
}

export function processSegment (point1, point2, offset) {
    var L = Math.sqrt((point1[0] - point2[0]) * (point1[0] - point2[0]) + (point1[1] - point2[1]) * (point1[1] - point2[1]))

    var out1x = point1[0] + offset * (point2[1] - point1[1]) / L
    var out2x = point2[0] + offset * (point2[1] - point1[1]) / L
    var out1y = point1[1] + offset * (point1[0] - point2[0]) / L
    var out2y = point2[1] + offset * (point1[0] - point2[0]) / L
    return [[out1x, out1y], [out2x, out2y]]
}

export function checkLineIntersection (line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    let denominator, a, b, numerator1, numerator2
    const result = [null, null]
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY))
    if (denominator === 0) return false
    a = line1StartY - line2StartY
    b = line1StartX - line2StartX
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b)
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b)
    a = numerator1 / denominator
    b = numerator2 / denominator

    result[0] = line1StartX + (a * (line1EndX - line1StartX))
    result[1] = line1StartY + (a * (line1EndY - line1StartY))
    // if (a > 0 && a < 1) return false
    return result
}

export function getInverseDistance (dist) {
    return dist > 0 ? -Math.abs(dist) : Math.abs(dist)
}

export function radiansToDegrees (radians) {
    return radians * 180 / Math.PI
}

export function degreesToRadians (degrees) {
    return degrees * Math.PI / 180
}

export function bearingToAzimuth (bearing) {
    let angle = bearing % 360
    if (angle < 0) { angle += 360 }
    return angle
}

const earthRadius = 6371008.8

const factors = {
    centimeters: earthRadius * 100,
    centimetres: earthRadius * 100,
    degrees: 180 / Math.PI,
    feet: earthRadius * 3.28084,
    inches: earthRadius * 39.370,
    kilometers: earthRadius / 1000,
    kilometres: earthRadius / 1000,
    meters: earthRadius,
    metres: earthRadius,
    miles: earthRadius / 1609.344,
    millimeters: earthRadius * 1000,
    millimetres: earthRadius * 1000,
    nauticalmiles: earthRadius / 1852,
    radians: 1,
    yards: earthRadius / 1.0936
}

export function lengthToRadians (distance, units) {
    var factor = factors[units || 'kilometers']
    return distance / factor
}

export function lengthToDegrees (distance, units) {
    if (units === null) units = 'kilometers'
    return radiansToDegrees(lengthToRadians(distance, units))
}

export function destination (origin, radiansDistance, bearing) {

    const bearingRad = degreesToRadians(bearing)

    const latitude2 = Math.asin(Math.sin(origin.radiansY) * Math.cos(radiansDistance) +
        Math.cos(origin.radiansY) * Math.sin(radiansDistance) * Math.cos(bearingRad))
    const longitude2 = origin.radiansX + Math.atan2(Math.sin(bearingRad) * Math.sin(radiansDistance) * Math.cos(origin.radiansY),
        Math.cos(radiansDistance) - Math.sin(origin.radiansY) * Math.sin(latitude2))
    const lng = radiansToDegrees(longitude2)
    const lat = radiansToDegrees(latitude2)

    return new Point([lng, lat])
}

export function distanceRadiansBetweenPoints (from, to) {
    var dLat = (from.radiansY - to.radiansY)
    var dLon = (from.radiansX - to.radiansX)
    var lat1 = from.radiansY
    var lat2 = to.radiansY

    var a = Math.pow(Math.sin(dLat / 2), 2) +
          Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2)

    return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
