import { getCoords, coordEach, bearing, point, polygon, bearingToAngle } from 'turf'
import { processSegment, checkLineIntersection } from './utils'
import { getJoin } from './joinTypes'

export function bufferPolygon (feature, distance, steps) {
  var coords = getCoords(feature)
  var finalCoords = []

  var prevCoords = coords[0][coords[0].length - 2]
  var nextCoords = null

  coordEach(feature, function (currentCoords, index) {
    if (index !== 0) prevCoords = coords[0][index - 1]

    if (index === coords[0].length - 1) nextCoords = coords[0][1]
    else nextCoords = coords[0][index + 1]

    var bearingPrevCoords = bearing(point(currentCoords), point(prevCoords))
    var bearingNextCoords = bearing(point(currentCoords), point(nextCoords))
    var angleInDegs = bearingToAngle(bearingToAngle(bearingNextCoords) - bearingToAngle(bearingPrevCoords))

    if (index > 0) {
      var segment = processSegment(currentCoords, nextCoords, distance)
      var prevSegment = processSegment(prevCoords, currentCoords, distance)
      if (angleInDegs < 180) {
        var outsector = getJoin('round', currentCoords, distance, bearingNextCoords, bearingPrevCoords, steps)
        finalCoords = finalCoords.concat(outsector)
      } else {
        var intersects = checkLineIntersection(segment[0][0], segment[0][1], segment[1][0], segment[1][1], prevSegment[0][0], prevSegment[0][1], prevSegment[1][0], prevSegment[1][1])
        finalCoords.push([intersects.x, intersects.y])
      }
    }
  })
  finalCoords.push(finalCoords[0])
  return polygon([finalCoords])
}
