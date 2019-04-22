import { bearing, point, polygon, multiPolygon, bearingToAngle, booleanClockwise, distance as calcDistance } from 'turf'
import { processSegment, checkLineIntersection, getInverseDistance } from './utils'
import { getJoin } from './joinTypes'

export function bufferPolygon (geometry, distance, steps) {
  const outCoords = []
  const inType = geometry.type

  const coordsToProcess = inType === 'Polygon' ? [geometry.coordinates] : geometry.coordinates

  for (let i = 0; i < coordsToProcess.length; i++) {
    const outPoly = []

    for (let ii = 0; ii < coordsToProcess[i].length; ii++) {
      const contour = coordsToProcess[i][ii]
      const isOuterRing = ii === 0
      const processingDistance = isOuterRing ? distance : getInverseDistance(distance)

      const isClockwise = booleanClockwise({
        type: 'LineString', coordinates: contour
      })

      outPoly.push(processContour(contour, processingDistance, steps, isOuterRing, isClockwise))
    }
    outCoords.push(outPoly)
  }
  return inType === 'Polygon' ? polygon(outCoords[0]) : multiPolygon(outCoords)
}

function processContour (contour, distance, steps, isOuterRing, isClockwise) {
  const coords = contour
  let outCoords = []

  let shouldNavigateForward = isOuterRing && !isClockwise

  if (shouldNavigateForward) {
    for (let i = 1; i < coords.length; i++) {
      const currentCoords = coords[i]
      const prevCoords = coords[i - 1]
      const nextCoords = i === coords.length - 1 ? coords[1] : coords[i + 1]
      outCoords = offSetContour(currentCoords, prevCoords, nextCoords, distance, steps, outCoords)
    }
  } else {
    for (let ii = coords.length - 2; ii >= 0; ii--) {
      const currentCoords = coords[ii]
      const prevCoords = coords[ii + 1]
      const nextCoords = ii === 0 ? coords[coords.length - 2] : coords[ii - 1]
      outCoords = offSetContour(currentCoords, prevCoords, nextCoords, distance, steps, outCoords)
    }
  }

  outCoords.push(outCoords[0])
  return outCoords
}

function offSetContour (currentCoords, prevCoords, nextCoords, distance, steps, outCoords) {
  const bearingPrevCoords = bearing(point(currentCoords), point(prevCoords))
  const bearingNextCoords = bearing(point(currentCoords), point(nextCoords))
  const angleInDegs = bearingToAngle(bearingToAngle(bearingNextCoords) - bearingToAngle(bearingPrevCoords))

  if (angleInDegs < 180 && distance > 0) {
    const outsector = getJoin('round', currentCoords, distance, bearingNextCoords, bearingPrevCoords, steps)
    outCoords = outCoords.concat(outsector)
  } else {
    const segDistance = calcDistance(point(currentCoords), point(nextCoords), {
      units: 'degrees'
    })
    if (segDistance < distance) {
      return outCoords
    }
    const segment = processSegment(currentCoords, nextCoords, distance)
    const prevSegment = processSegment(prevCoords, currentCoords, distance)
    const intersects = checkLineIntersection(segment[0][0], segment[0][1], segment[1][0], segment[1][1], prevSegment[0][0], prevSegment[0][1], prevSegment[1][0], prevSegment[1][1])
    outCoords.push([intersects.x, intersects.y])
  }
  return outCoords
}
