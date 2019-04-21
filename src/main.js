import {
  polygon,
  multiPolygon,
  lineEach,
  distanceToDegrees,
  circle
} from 'turf'

import polygonClipping from 'polygon-clipping'
import { offsetSegment, roundJoin, angle } from './utils'

function bufferPoint(geometry, distance, steps) {
  if (distance < 0) {
    return polygon([])
  }

  return circle(geometry, distance, {
    // We use 4x steps because we treat point as 360 angle
    steps: steps * 4,
    units: 'degrees'
  })
}

function eachAngle(segment, isPolygon, callback) {
  for (let i = 0; i < segment.length - 2; i++) {
    callback([segment[i], segment[i + 1], segment[i + 2]])
  }

  if (isPolygon) {
    callback([
      segment[segment.length - 2],
      segment[segment.length - 1],
      segment[1]
    ])
  } else {
    callback([segment[1], segment[0], segment[1]])
    callback([
      segment[segment.length - 2],
      segment[segment.length - 1],
      segment[segment.length - 2]
    ])
  }
}

function buffer(geometry, distance, steps, endType, joinType) {
  const isPolygon =
    geometry.type === 'Polygon' || geometry.type === 'MultiPolygon'

  if (!isPolygon && distance <= 0) {
    return polygon([])
  }

  const parts = []

  const createJoin = roundJoin

  const absdistance = Math.abs(distance)
  lineEach(geometry, function(segment) {
    const coords = segment.geometry.coordinates

    eachAngle(coords, isPolygon, function(angle) {
      parts.push(processAngle(angle, absdistance, steps, createJoin))
    })
  })

  let result = polygonClipping.union(parts)

  if (distance >= 0) {
    if (isPolygon) {
      result = polygonClipping.union(geometry.coordinates, result)
    }
  } else {
    result = polygonClipping.difference(geometry.coordinates, result)
  }

  if (!result || !result[0] || typeof result[0][0][0] === 'number') {
    return polygon(result)
  } else {
    return multiPolygon(result)
  }
}

function processAngle(coords, distance, steps, createJoin) {
  const firstin = offsetSegment(coords[1], coords[0], distance)
  const firstout = offsetSegment(coords[1], coords[0], -distance)
  const angleInRads = angle(coords[2], coords[1], coords[0])
  const angleSteps = Math.max(
    1,
    Math.round(steps * Math.abs(angleInRads / Math.PI - 1) * 2)
  )

  if (angleInRads < Math.PI) {
    const secondin = offsetSegment(coords[1], coords[2], distance)

    return [
      [coords[1], firstin[0], firstin[1], firstout[1]].concat(
        createJoin(coords[1], distance, firstout[0], secondin[0], angleSteps),
        [coords[1]]
      )
    ]
  } else {
    const secondout = offsetSegment(coords[1], coords[2], -distance)

    return [
      [coords[1]].concat(
        createJoin(coords[1], distance, secondout[0], firstin[0], angleSteps),
        [firstin[1], firstout[1], firstout[0], coords[1]]
      )
    ]
  }
}

export function bufferGeoJSON(geojson, distance, units, steps) {
  if (!geojson) throw new Error('geojson-buffer: Feature is required')

  if (distance === undefined || distance === null || isNaN(distance))
    throw new Error('dgeojson-buffer: Distance is required')

  const geometry = geojson.type === 'Feature' ? geojson.geometry : geojson

  const numSteps = steps || 8
  const properties = geojson.properties || {}

  const distanceDegrees = distanceToDegrees(distance, units)

  let buffered

  switch (geometry.type) {
    case 'Polygon':
    case 'MultiPolygon':
    case 'LineString':
    case 'MultiLineString':
      buffered = buffer(geometry, distanceDegrees, numSteps)
      break
    case 'Point':
      buffered = bufferPoint(geometry, distanceDegrees, numSteps)
      break
  }

  buffered.properties = properties

  return buffered
}
