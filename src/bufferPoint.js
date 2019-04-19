import { circle } from 'turf'

export function bufferPoint(geometry, distance, steps) {
  return circle(geometry, distance, {
    // We use 4x steps because we treat point as 360 angle
    steps: steps * 4,
    units: 'degrees'
  })
}
