import { lineArc, point, destination } from 'turf'

export function getJoin (joinType, coords, distance, bearingNextCoords, bearingPrevCoords, numSteps) {
  switch (joinType) {
    case 'round':
      return createRounded(coords, distance, bearingNextCoords, bearingPrevCoords, numSteps)
    // case 'mitre':
    //   return createMitre(feature, distance, numSteps)
  }
}

export function getEnd (endType, coords, distance, bearingNextCoords, bearingPrevCoords, numSteps) {
  switch (endType) {
    case 'round':
      return createRounded(coords, distance, bearingNextCoords, bearingPrevCoords, numSteps)
    case 'square':
      return createSquare()
    case 'flat':
      return createFlat(coords)
  }
}

export function createRounded (coords, distance, bearingNextCoords, bearingPrevCoords, numSteps) {
  // var arc = createArc(coords, distance, destination(coords, distance, bearingNextCoords - 90).geometry.coordinates, destination(coords, distance, bearingPrevCoords + 90).geometry.coordinates, numSteps, false)
  // return arc
  var arc = lineArc(point(coords), distance, bearingNextCoords + 90, bearingPrevCoords - 90, {
    steps: numSteps,
    units: 'degrees'
  })
  return arc.geometry.coordinates.reverse()
}

function createArc (center, radius, startVertex, endVertex, segments, outwards) {
  const outVertices = []

  const PI2 = Math.PI * 2
  let startAngle = Math.atan2(startVertex[1] - center[1], startVertex[0] - center[0])
  let endAngle = Math.atan2(endVertex[1] - center[1], endVertex[0] - center[0])

  if (segments % 2 === 0) segments -= 1

  if (startAngle < 0) startAngle += PI2
  if (endAngle < 0) endAngle += PI2

  var angle = ((startAngle > endAngle)
    ? (startAngle - endAngle)
    : (startAngle + PI2 - endAngle))

  const segmentAngle = ((outwards) ? -angle : PI2 - angle) / segments

  outVertices.push(startVertex)
  for (var i = 1; i < segments; ++i) {
    angle = startAngle + segmentAngle * i
    outVertices.push([
      center[0] + Math.cos(angle) * radius,
      center[1] + Math.sin(angle) * radius
    ])
  }
  outVertices.push(endVertex)
  return outVertices
}

function createSquare () {
  return []
}

function createFlat (coords) {
  return []
}
