import Point from './Point'
import { destination } from './utils'

export function getJoin (joinType, coords, distance, distanceRadians, bearingNextCoords, bearingPrevCoords, numSteps) {
    switch (joinType) {
    case 'round':
        return createRounded(coords, distance, distanceRadians, bearingNextCoords, bearingPrevCoords, numSteps)
      // case 'mitre':
      //   return createMitre(feature, distance, numSteps)
    }
}

export function getEnd (endType, coords, distance, distanceRadians, bearingNextCoords, bearingPrevCoords, numSteps) {
    switch (endType) {
    case 'round':
        return createRounded(coords, distance, distanceRadians, bearingNextCoords, bearingPrevCoords, numSteps)
    case 'square':
        return createSquare()
    case 'flat':
        return createFlat(coords)
    }
}

export function createRounded (coords, distance, distanceRadians, bearingNextCoords, bearingPrevCoords, numSteps) {
    return createArc(coords, distance, bearingPrevCoords, bearingNextCoords, numSteps, false)
}

function createArc (center, radius, startVertex, endVertex, segments, outwards) {
    const outVertices = []
    const PI2 = Math.PI * 2
    let startAngle = Math.atan2(startVertex.y - center.y, startVertex.x - center.x)
    let endAngle = Math.atan2(endVertex.y - center.y, endVertex.x - center.x)

    if (startAngle < 0) startAngle += PI2
    if (endAngle < 0) endAngle += PI2

    var angle = ((startAngle > endAngle)
        ? (startAngle - endAngle)
        : (startAngle + PI2 - endAngle))

    const segmentAngle = (PI2 - angle) / segments

    for (var i = 1; i < segments + 1; ++i) {
        angle = startAngle + segmentAngle * i
        outVertices.push(new Point([
            center.x + Math.cos(angle) * radius,
            center.y + Math.sin(angle) * radius
        ]))
    }
    return outVertices
}

function createSquare () {
    return []
}

function createFlat (coords) {
    return []
}
