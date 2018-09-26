import { getCoords, coordEach, bearing, point, polygon, bearingToAngle } from 'turf'
import { processSegment, checkLineIntersection } from './utils'
import { getJoin, getEnd } from './joinTypes'

export function bufferLine (feature, distance, steps, endType, joinType) {
  var coords = getCoords(feature)
  var finalCoords = []
  var otherSideCoords = []
  var prevCoords = coords[coords.length - 2]
  var nextCoords = null
  var finalRounded = null

  coordEach(feature, function (currentCoords, index) {
    if (index === 0) {
      nextCoords = coords[index + 1]
      var bearingNextCoords = bearing(point(currentCoords), point(nextCoords))
      var startEndcap = getEnd('round', currentCoords, distance, bearingNextCoords, bearingNextCoords, steps)
      finalCoords = finalCoords.concat(startEndcap)
    } else if (index === coords.length - 1) {
      prevCoords = coords[index - 1]
      var bearingPrevCoords = bearing(point(currentCoords), point(prevCoords))
      var endEndcap = getEnd('round', currentCoords, distance, bearingPrevCoords, bearingPrevCoords, steps)
      finalRounded = endEndcap
    } else {
      prevCoords = coords[index - 1]
      nextCoords = coords[index + 1]
      var bearingPrevCoords = bearing(point(currentCoords), point(prevCoords))
      var bearingNextCoords = bearing(point(currentCoords), point(nextCoords))
      var angleInDegs = bearingToAngle(bearingToAngle(bearingNextCoords) - bearingToAngle(bearingPrevCoords))
      var segment = processSegment(currentCoords, nextCoords, distance)

      var prevSegment = processSegment(prevCoords, currentCoords, distance)

      if (angleInDegs < 180) {
        var outsector = getJoin('round', currentCoords, distance, bearingNextCoords, bearingPrevCoords, steps)
        finalCoords = finalCoords.concat(outsector)

        var segmentRev = processSegment(currentCoords, nextCoords, -Math.abs(distance))
        var prevSegmentRev = processSegment(prevCoords, currentCoords, -Math.abs(distance))
        var intersects = checkLineIntersection(segmentRev[0][0], segmentRev[0][1], segmentRev[1][0], segmentRev[1][1], prevSegmentRev[0][0], prevSegmentRev[0][1], prevSegmentRev[1][0], prevSegmentRev[1][1])
        otherSideCoords.push([intersects.x, intersects.y])
      } else {
        var intersects = checkLineIntersection(segment[0][0], segment[0][1], segment[1][0], segment[1][1], prevSegment[0][0], prevSegment[0][1], prevSegment[1][0], prevSegment[1][1])
        finalCoords.push([intersects.x, intersects.y])
        var outsector = getJoin('round', currentCoords, distance, bearingPrevCoords, bearingNextCoords, steps)
        otherSideCoords = otherSideCoords.concat(outsector.reverse())
      }
    }
  })
  finalCoords = finalCoords.concat(finalRounded)
  finalCoords = finalCoords.concat(otherSideCoords.reverse())
  finalCoords.push(finalCoords[0])
  return polygon([finalCoords], feature.properties)
}

