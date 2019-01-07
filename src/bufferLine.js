import { getCoords, coordEach, bearing, point, polygon, bearingToAngle, multiPolygon, lineEach } from 'turf'
import { processSegment, checkLineIntersection } from './utils'
import { getJoin, getEnd } from './joinTypes'

export function bufferLine (geometry, distance, steps, endType, joinType) {
  const outCoords = [[]]
  const inType = geometry.type
  if (inType === 'MultiLineString') {
    for (var i = 1; i < geometry.coordinates.length; i++) {
      outCoords.push([])
    }
  }

  // Loop through each of the lines in a multiline
  lineEach(geometry, function (contour, featureIndex, multiFeatureIndex, contourIndex) {
    outCoords[multiFeatureIndex].push(processContour(contour, distance, steps))
  })

  return inType === 'Polygon' ? polygon(outCoords[0]) : multiPolygon(outCoords)
}

function processContour (contour, distance, steps) {
  const coords = getCoords(contour)
  let outCoords = []
  let otherSideOutCoords = []
  let prevCoords = null
  let nextCoords = coords[1]
  let endcap = null

  coordEach(contour, function (currentCoords, index) {
    // Handle the start point of the line
    if (index === 0) {
      const bearingNextCoords = bearing(point(currentCoords), point(nextCoords))
      const startEndcap = getEnd('round', currentCoords, distance, bearingNextCoords, bearingNextCoords, steps)
      outCoords = outCoords.concat(startEndcap)

    // Handle the endpoint of the line
    } else if (index === coords.length - 1) {
      prevCoords = coords[index - 1]
      const bearingPrevCoords = bearing(point(currentCoords), point(prevCoords))
      endcap = getEnd('round', currentCoords, distance, bearingPrevCoords, bearingPrevCoords, steps)

    // Handle the middle segments
    } else {
      prevCoords = coords[index - 1]
      nextCoords = coords[index + 1]
      const bearingPrevCoords = bearing(point(currentCoords), point(prevCoords))
      const bearingNextCoords = bearing(point(currentCoords), point(nextCoords))
      const angleInDegs = bearingToAngle(bearingToAngle(bearingNextCoords) - bearingToAngle(bearingPrevCoords))

      if (angleInDegs < 180) {
        const outsector = getJoin('round', currentCoords, distance, bearingNextCoords, bearingPrevCoords, steps)
        outCoords = outCoords.concat(outsector)

        // Handle the reverse side of the line
        const segmentRev = processSegment(currentCoords, nextCoords, -Math.abs(distance))
        const prevSegmentRev = processSegment(prevCoords, currentCoords, -Math.abs(distance))
        const intersects = checkLineIntersection(segmentRev[0][0], segmentRev[0][1], segmentRev[1][0], segmentRev[1][1], prevSegmentRev[0][0], prevSegmentRev[0][1], prevSegmentRev[1][0], prevSegmentRev[1][1])
        otherSideOutCoords.push([intersects.x, intersects.y])
      } else {
        const segment = processSegment(currentCoords, nextCoords, distance)
        const prevSegment = processSegment(prevCoords, currentCoords, distance)
        const intersects = checkLineIntersection(segment[0][0], segment[0][1], segment[1][0], segment[1][1], prevSegment[0][0], prevSegment[0][1], prevSegment[1][0], prevSegment[1][1])
        outCoords.push([intersects.x, intersects.y])

        // Handle the reverse side of the line
        const outsector = getJoin('round', currentCoords, distance, bearingPrevCoords, bearingNextCoords, steps)
        otherSideOutCoords = otherSideOutCoords.concat(outsector.reverse())
      }
    }
  })

  // Add the final endcap on
  outCoords = outCoords.concat(endcap)

  // Attach the reversed side coords
  outCoords = outCoords.concat(otherSideOutCoords.reverse())
  outCoords.push(outCoords[0])
  return outCoords
}
