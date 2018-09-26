import { circle } from 'turf'

export function bufferPoint (geometry, distance, steps) {
  return circle(geometry, distance, {
    steps: steps,
    units: 'degrees'
  })
}
