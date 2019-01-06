import { getCoords, coordEach, bearing, point, lineString, polygon, bearingToAngle, booleanClockwise, rewind } from 'turf'
import { processSegment, checkLineIntersection } from './utils'
import { getJoin } from './joinTypes'

export function bufferPolygon (geometry, distance, steps) {
  if (booleanClockwise(lineString(geometry.coordinates[0]))) {
    console.warn('geojson-buffer: Input polygon had incorrect winding order')
    geometry = rewind(geometry)
  }
  var coords = getCoords(geometry)
  var outCoords = []

  coordEach(geometry, function (currentCoords, index) {
    if (index > 0) {
      const prevCoords = coords[0][index - 1]
      const nextCoords = index === coords[0].length - 1 ? coords[0][1] : coords[0][index + 1]

      var bearingPrevCoords = bearing(point(currentCoords), point(prevCoords))
      var bearingNextCoords = bearing(point(currentCoords), point(nextCoords))
      var angleInDegs = bearingToAngle(bearingToAngle(bearingNextCoords) - bearingToAngle(bearingPrevCoords))

      if (angleInDegs < 180) {
        var outsector = getJoin('round', currentCoords, distance, bearingNextCoords, bearingPrevCoords, steps)
        outCoords = outCoords.concat(outsector)
      } else {
        var segment = processSegment(currentCoords, nextCoords, distance)
        var prevSegment = processSegment(prevCoords, currentCoords, distance)
        var intersects = checkLineIntersection(segment[0][0], segment[0][1], segment[1][0], segment[1][1], prevSegment[0][0], prevSegment[0][1], prevSegment[1][0], prevSegment[1][1])
        outCoords.push([intersects.x, intersects.y])
      }
    }
  })
  outCoords.push(outCoords[0])
  return polygon([outCoords])
}
