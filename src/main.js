import { distanceToDegrees, polygon } from 'turf'
import { bufferLine } from './bufferLine'
import { bufferPolygon } from './bufferPolygon'
import { bufferPoint } from './bufferPoint'
import polygonClipping from 'polygon-clipping'

export function bufferGeoJSON (geojson, distance, units, steps) {
  if (!geojson) throw new Error('feature is required')
  if (distance === undefined || distance === null || isNaN(distance)) throw new Error('distance is required')

  var numSteps = steps || 64
  var properties = geojson.properties || {}

  var geometry = (geojson.type === 'Feature') ? geojson.geometry : geojson
  var distance = distanceToDegrees(distance, units)

  var buffered = null
  switch (geometry.type) {
    case 'Polygon':
      buffered = bufferPolygon(geometry, distance, numSteps)
      buffered = polygon(polygonClipping.union(buffered.geometry.coordinates)[0])
      break
    case 'LineString':
      buffered = bufferLine(geometry, distance, numSteps)
      break
    case 'Point':
      buffered = bufferPoint(geometry, distance, numSteps)
  }
  buffered.properties = properties
  return buffered
}
