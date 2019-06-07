import { setupStructures } from './setupStructures'
import { lengthToDegrees, lengthToRadians } from './utils'
import { removeGlobalIntersections } from './removeIntersection'
import shamosHoey from './lib/shamosHoey'

export function bufferGeoJSON (geojson, distance, units, steps) {

    if (!geojson) throw new Error('geojson-buffer: Feature is required')
    if (distance === undefined || distance === null || isNaN(distance)) throw new Error('dgeojson-buffer: Distance is required')

    const geometry = geojson.type === 'Feature' ? geojson.geometry : geojson

    if ((geometry.type === 'Point' || geometry.type === 'MultiPoint' || geometry.type === 'LineString' || geometry.type === 'MultiLineString') && distance < 0) {
        throw new Error('geojson-buffer: If offsetting a point or linestring the distance must be positive')
    }

    const numSteps = steps || 32
    const properties = geojson.properties || {}

    const distanceDegrees = lengthToDegrees(distance, units)
    const distanceRadians = lengthToRadians(distanceDegrees, 'degrees')

    const contours = setupStructures(geojson)
    const rawOffsetCoords = []

    for (var i = 0; i < contours.length; i++) {
        rawOffsetCoords.push(contours[i].createRawOffset(distanceDegrees, distanceRadians, numSteps))
    }

    const intersectionPoints = shamosHoey({
        type: 'Polygon',
        coordinates: rawOffsetCoords
    }, {
        booleanOnly: false
    })

    if (intersectionPoints.length === 0) return rawOffsetCoords
    return removeGlobalIntersections(rawOffsetCoords, intersectionPoints)

    // return polygonClipping.union(out)
}
