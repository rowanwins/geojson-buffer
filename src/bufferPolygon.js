import { getCoords, coordEach, bearing, point, polygon, multiPolygon, bearingToAngle, booleanClockwise, rewind, lineEach } from 'turf'
import { processSegment, checkLineIntersection, getInverseDistance } from './utils'
import { getJoin } from './joinTypes'

export function bufferPolygon (geometry, distance, steps) {
  const outCoords = [[]]
  const inType = geometry.type
  if (inType === 'MultiPolygon') {
    for (var i = 1; i < geometry.coordinates.length; i++) {
      outCoords.push([])
    }
  }
  // Loop through each of the rings of the polygon (eg exterior and holes)
  lineEach(geometry, function (contour, featureIndex, multiFeatureIndex, contourIndex) {
    if (contourIndex === 0) {
      if (booleanClockwise(contour.geometry.coordinates)) {
        contour = rewind(contour, {
          reverse: true
        })
      }
      outCoords[multiFeatureIndex].push(processContour(contour, distance, steps))
    } else {
      if (!booleanClockwise(contour.geometry.coordinates)) {
        contour = rewind(contour, {
          reverse: true
        })
      }
      outCoords[multiFeatureIndex].push(processContour(contour, getInverseDistance(distance), steps))
    }
  })

  return inType === 'Polygon' ? polygon(outCoords[0]) : multiPolygon(outCoords)
}

function processContour (contour, distance, steps) {
  const coords = getCoords(contour)
  let outCoords = []
  coordEach(contour, function (currentCoords, index) {
    if (index > 0) {
      const prevCoords = coords[index - 1]
      const nextCoords = index === coords.length - 1 ? coords[1] : coords[index + 1]
      const bearingPrevCoords = bearing(point(currentCoords), point(prevCoords))
      const bearingNextCoords = bearing(point(currentCoords), point(nextCoords))
      const angleInDegs = bearingToAngle(bearingToAngle(bearingNextCoords) - bearingToAngle(bearingPrevCoords))

      if (angleInDegs < 180) {
        const outsector = getJoin('round', currentCoords, distance, bearingNextCoords, bearingPrevCoords, steps)
        outCoords = outCoords.concat(outsector)
      } else {
        const segment = processSegment(currentCoords, nextCoords, distance)
        const prevSegment = processSegment(prevCoords, currentCoords, distance)
        const intersects = checkLineIntersection(segment[0][0], segment[0][1], segment[1][0], segment[1][1], prevSegment[0][0], prevSegment[0][1], prevSegment[1][0], prevSegment[1][1])
        outCoords.push([intersects.x, intersects.y])
      }
    }
  })
  outCoords.push(outCoords[0])
  return outCoords
}
