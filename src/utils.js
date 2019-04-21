const len = (a, b) => Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)
const dot = (a, b) => a[0] * b[0] + a[1] * b[1]
const cross = (a, b) => a[0] * b[1] - a[1] * b[0]
const vec = (a, b) => [b[0] - a[0], b[1] - a[1]]

/**
 * Offset Segment
 * Inspiration taken from http://stackoverflow.com/questions/2825412/draw-a-parallel-line
 *
 * @private
 * @param {Array<number>} point1 Point coordinates
 * @param {Array<number>} point2 Point coordinates
 * @param {number} offset Offset
 * @returns {Array<Array<number>>} offset points
 */
export function offsetSegment(point1, point2, offset) {
  const L = len(point1, point2)

  const out1x = point1[0] + (offset * (point2[1] - point1[1])) / L
  const out2x = point2[0] + (offset * (point2[1] - point1[1])) / L
  const out1y = point1[1] + (offset * (point1[0] - point2[0])) / L
  const out2y = point2[1] + (offset * (point1[0] - point2[0])) / L

  return [[out1x, out1y], [out2x, out2y]]
}

export function angle(a, b, c) {
  const v1 = vec(b, a)
  const v2 = vec(b, c)
  const angle = Math.atan2(cross(v1, v2), dot(v1, v2))
  if (angle < 0) {
    return angle + Math.PI * 2
  }
  return angle
}

export function roundJoin(center, distance, start, end, steps) {
  const outVertices = []

  const PI2 = Math.PI * 2
  let startAngle = Math.atan2(start[1] - center[1], start[0] - center[0])
  let endAngle = Math.atan2(end[1] - center[1], end[0] - center[0])

  if (startAngle < 0) startAngle += PI2
  if (endAngle < 0) endAngle += PI2

  var angle =
    startAngle > endAngle ? startAngle - endAngle : startAngle + PI2 - endAngle

  const segmentAngle = (PI2 - angle) / steps

  for (var i = 0; i < steps + 1; i += 1) {
    angle = startAngle + segmentAngle * i
    outVertices.push([
      center[0] + Math.cos(angle) * distance,
      center[1] + Math.sin(angle) * distance
    ])
  }
  return outVertices
}
