import path from 'path'
import test from 'ava'
import { bufferGeoJSON } from '../src/main'
import loadJsonFile from 'load-json-file'
import write from 'write-json-file'

import { distance, point } from 'turf'

const p = loadJsonFile.sync(path.join(__dirname, 'inputs', 'point.json'))

test('Point test -- expected outputs', t => {
  const output = bufferGeoJSON(p, 1, 'kilometers')
  t.is(output.type, 'Feature')
  t.is(output.geometry.type, 'Polygon')

  if (process.env.REGEN) write.sync(path.join(__dirname, 'outputs', 'point.json'), output)
  const expected = loadJsonFile.sync(path.join(__dirname, 'outputs', 'point.json'))
  t.deepEqual(output, expected)
})

test('Ensure sensible distance', t => {
  const regPoint = point([0, 0])
  const output = bufferGeoJSON(regPoint, 1, 'kilometers')
  const dist = distance(regPoint, point(output.geometry.coordinates[0][0]), {
    units: 'kilometers'
  })
  t.is(dist > 0.99999 && dist < 1.00001, true)

  const dist2 = distance(regPoint, point(output.geometry.coordinates[0][30]), {
    units: 'kilometers'
  })
  t.is(dist2 > 0.99999 && dist2 < 1.00001, true)
})

test('Ensure sensible distance - Northern latitudes', t => {
  const northernPoint = point([-100, 70])
  const output = bufferGeoJSON(northernPoint, 1, 'kilometers')
  const dist = distance(northernPoint, point(output.geometry.coordinates[0][0]), {
    units: 'kilometers'
  })
  t.is(dist > 0.99999 && dist < 1.00001, true)

  // Somewhere a quarter of the way around the buffer
  const numCoords = Math.floor(output.geometry.coordinates[0].length / 4)
  const dist2 = distance(northernPoint, point(output.geometry.coordinates[0][numCoords]), {
    units: 'kilometers'
  })
  t.is(dist2 > 0.99999 && dist2 < 1.00001, true)
})

test('Distance parameter works', t => {
  const regPoint = point([0, 0])
  const output = bufferGeoJSON(regPoint, 2, 'kilometers')
  const dist = distance(regPoint, point(output.geometry.coordinates[0][0]), {
    units: 'kilometers'
  })
  t.is(dist > 1.99999 && dist < 2.00001, true)
})

test('Units parameter works', t => {
  const regPoint = point([0, 0])
  const output = bufferGeoJSON(regPoint, 2, 'miles')
  const dist = distance(regPoint, point(output.geometry.coordinates[0][0]), {
    units: 'miles'
  })
  t.is(dist > 1.99999 && dist < 2.00001, true)
})

test('Steps parameter works', t => {
  const regPoint = point([0, 0])
  const output = bufferGeoJSON(regPoint, 2, 'miles', 10)

  // Remembering that the fist & last point is duplicated in geojson
  t.is(output.geometry.coordinates[0].length, 11)
})
