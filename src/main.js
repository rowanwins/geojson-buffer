import { distanceToDegrees, polygon, kinks, multiPolygon } from 'turf'
import { bufferLine } from './bufferLine'
import { bufferPolygon } from './bufferPolygon'
import { bufferPoint } from './bufferPoint'
import polygonClipping from 'polygon-clipping'

export function bufferGeoJSON (geojson, distance, units, steps) {
  if (!geojson) throw new Error('geojson-buffer: Feature is required')
  if (distance === undefined || distance === null || isNaN(distance)) throw new Error('dgeojson-buffer: Distance is required')

  const geometry = (geojson.type === 'Feature') ? geojson.geometry : geojson

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
      if (checkforOverlaps(buffered)) {
        buffered = polygonClipping.union(buffered.geometry.coordinates)
        buffered = buffered.length === 1 ? polygon(buffered[0]) : multiPolygon(buffered)
      }
      break
    case 'LineString':
    case 'MultiLineString':
      buffered = bufferLine(geometry, distanceDegrees, numSteps)
      if (checkforOverlaps(buffered)) {
        buffered = polygonClipping.union(buffered.geometry.coordinates)
        buffered = buffered.length === 1 ? polygon(buffered[0]) : multiPolygon(buffered)
      }
      break
    case 'Point':
      buffered = bufferPoint(geometry, distanceDegrees, numSteps)
  }
  buffered.properties = properties
  return buffered
}

function checkforOverlaps (geom) {
  const ips = kinks(geom)
  if (ips.features.length > 0) return true
  return false
}
