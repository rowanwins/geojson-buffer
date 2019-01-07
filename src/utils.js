/**
 * Process Segment
 * Inspiration taken from http://stackoverflow.com/questions/2825412/draw-a-parallel-line
 *
 * @private
 * @param {Array<number>} point1 Point coordinates
 * @param {Array<number>} point2 Point coordinates
 * @param {number} offset Offset
 * @returns {Array<Array<number>>} offset points
 */
export function processSegment (point1, point2, offset) {
  var L = Math.sqrt((point1[0] - point2[0]) * (point1[0] - point2[0]) + (point1[1] - point2[1]) * (point1[1] - point2[1]))

  var out1x = point1[0] + offset * (point2[1] - point1[1]) / L
  var out2x = point2[0] + offset * (point2[1] - point1[1]) / L
  var out1y = point1[1] + offset * (point1[0] - point2[0]) / L
  var out2y = point2[1] + offset * (point1[0] - point2[0]) / L
  return [[out1x, out1y], [out2x, out2y]]
}

/**
 * Check if lines intersect
 *
 * @private
 * @param {Array<number>} point1 Point coordinates
 * @param {Array<number>} point2 Point coordinates
 * @returns {Array<Array<number>>} offset points
 */
export function checkLineIntersection (line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
  var denominator, a, b, numerator1, numerator2, result
  result = {
    x: null,
    y: null,
    onLine1: false,
    onLine2: false
  }
  denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY))
  if (denominator === 0) return result
  a = line1StartY - line2StartY
  b = line1StartX - line2StartX
  numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b)
  numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b)
  a = numerator1 / denominator
  b = numerator2 / denominator

  result.x = line1StartX + (a * (line1EndX - line1StartX))
  result.y = line1StartY + (a * (line1EndY - line1StartY))

  if (a > 0 && a < 1) result.onLine1 = true
  return result
}

export function getInverseDistance (dist) {
  return dist > 0 ? -Math.abs(dist) : Math.abs(dist)
}