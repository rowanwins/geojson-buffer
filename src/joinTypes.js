import { lineArc, point } from 'turf'

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
  var arc = lineArc(point(coords), distance, bearingNextCoords + 90, bearingPrevCoords - 90, {
    steps: numSteps,
    units: 'degrees'
  })
  return arc.geometry.coordinates.reverse()
}

function createSquare () {
  return []
}

function createFlat (coords) {
  return []
}
