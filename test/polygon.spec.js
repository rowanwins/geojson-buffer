import path from 'path'
import test from 'ava'
import { bufferGeoJSON } from '../src/main'
import loadJsonFile from 'load-json-file'
import write from 'write-json-file'

import { distance, point, polygon, booleanPointInPolygon } from 'turf'

const polygonHarness = loadJsonFile.sync(path.join(__dirname, 'inputs', 'polygon.json'))

test('Polygon test', t => {
  const output = bufferGeoJSON(polygonHarness, 1, 'kilometers')
  t.is(output.type, 'Feature')
  t.is(output.geometry.type, 'Polygon')

  t.is(booleanPointInPolygon(point(output.geometry.coordinates[0][0]), polygonHarness), false)

  if (process.env.REGEN) write.sync(path.join(__dirname, 'outputs', 'polygon.json'), output)
  const expected = loadJsonFile.sync(path.join(__dirname, 'outputs', 'polygon.json'))
  t.deepEqual(output, expected)
})

test('Distance parameter works', t => {
  const box = polygon([[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]])
  const output = bufferGeoJSON(box, 2, 'kilometers')

  // Remembering that it's the 2nd point of the output is actually closest to the first point of the input
  const dist = distance(point(box.geometry.coordinates[0][0]), point(output.geometry.coordinates[0][1]), {
    units: 'kilometers'
  })
  t.is(dist > 1.99999 && dist < 2.00001, true)
})

test('Units parameter works', t => {
  const box = polygon([[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]])
  const output = bufferGeoJSON(box, 2, 'miles')
  const dist = distance(point(box.geometry.coordinates[0][0]), point(output.geometry.coordinates[0][1]), {
    units: 'miles'
  })
  t.is(dist > 1.99999 && dist < 2.00001, true)
})

test('Steps parameter works', t => {
  const box = polygon([[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]])
  const output = bufferGeoJSON(box, 2, 'miles', 10)
  // Remembering that the fist & last point is duplicated in geojson
  t.is(output.geometry.coordinates[0].length, 41)
})

test('Incorrectly winding polygon works', t => {
  const box = polygon([[[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]])
  const output = bufferGeoJSON(box, 2, 'miles', 10)
  // Remembering that the fist & last point is duplicated in geojson
  t.is(output.geometry.coordinates[0].length, 41)
})
