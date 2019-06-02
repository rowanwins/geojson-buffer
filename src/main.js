import { setupStructures } from './setupStructures'
import { lengthToDegrees, lengthToRadians } from './utils'
import polygonClipping from 'polygon-clipping/dist/polygon-clipping.esm.js'

export function bufferGeoJSON (geojson, distance, units, steps) {

    if (!geojson) throw new Error('geojson-buffer: Feature is required')
    if (distance === undefined || distance === null || isNaN(distance)) throw new Error('dgeojson-buffer: Distance is required')

    const geometry = geojson.type === 'Feature' ? geojson.geometry : geojson

    if ((geometry.type === 'Point' || geometry.type === 'MultiPoint' || geometry.type === 'LineString' || geometry.type === 'MultiLineString') && distance < 0) {
        throw new Error('geojson-buffer: If offsetting a point or linestring the distance must be positive')
    }

    // const numSteps = steps || 64
    // const properties = geojson.properties || {}

    const distanceDegrees = lengthToDegrees(distance, units)
    const distanceRadians = lengthToRadians(distanceDegrees, 'degrees')

    // let buffered = null

    const contours = setupStructures(geojson)
    const out = []
    for (var i = 0; i < contours.length; i++) {
        contours[i].offsetEdges(distanceDegrees)
        contours[i].rejoinOffsetEdges(distanceDegrees, distanceRadians)
        out.push(contours[i].removeGlobalIntersections())
    }

    return polygonClipping.union(out)
    // return out
}
