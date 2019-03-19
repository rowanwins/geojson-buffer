import { distanceToDegrees, polygon, multiPolygon } from 'turf'
import { bufferLine } from './bufferLine'
import { bufferPolygon } from './bufferPolygon'
import { bufferPoint } from './bufferPoint'
import isSimple from 'shamos-hoey'
import polygonClipping from 'polygon-clipping/dist/polygon-clipping.esm.js'

export function bufferGeoJSON (geojson, distance, units, steps) {

  if (!geojson) throw new Error('geojson-buffer: Feature is required')
  if (distance === undefined || distance === null || isNaN(distance)) throw new Error('dgeojson-buffer: Distance is required')

  const geometry = geojson.type === 'Feature' ? geojson.geometry : geojson

  if ((geometry.type === 'Point' || geometry.type === 'MultiPoint' || geometry.type === 'LineString' || geometry.type === 'MultiLineString') && distance < 0) {
    throw new Error('geojson-buffer: If offsetting a point or linestring the distance must be positive')
  }

  const numSteps = steps || 64
  const properties = geojson.properties || {}

  const distanceDegrees = distanceToDegrees(distance, units)

  let buffered = null
  switch (geometry.type) {
    case 'Polygon':
    case 'MultiPolygon':
      buffered = bufferPolygon(geometry, distanceDegrees, numSteps)
      // if (!isSimple(buffered)) {
        // buffered = polygonClipping.union(buffered.geometry.coordinates)
        // buffered = buffered.length === 1 ? polygon(buffered[0]) : multiPolygon(buffered)
      // }
      break
    case 'LineString':
    case 'MultiLineString':
      buffered = bufferLine(geometry, distanceDegrees, numSteps)
      if (!isSimple(buffered)) {
        buffered = polygonClipping.union(buffered.geometry.coordinates)
        buffered = buffered.length === 1 ? polygon(buffered[0]) : multiPolygon(buffered)
      }
      break
    case 'Point':
      buffered = bufferPoint(geometry, distanceDegrees, numSteps)
      break
  }
  buffered.properties = properties
  return buffered
}
