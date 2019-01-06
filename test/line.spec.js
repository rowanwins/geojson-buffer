import path from 'path'
import test from 'ava'
import { bufferGeoJSON } from '../src/main'
import loadJsonFile from 'load-json-file'
import write from 'write-json-file'

import { distance, point, lineString } from 'turf'

const lineHarness = loadJsonFile.sync(path.join(__dirname, 'inputs', 'linestring.json'))

test('Polyline test', t => {
  const output = bufferGeoJSON(lineHarness, 1, 'kilometers')
  t.is(output.type, 'Feature')
  t.is(output.geometry.type, 'Polygon')

  if (process.env.REGEN) write.sync(path.join(__dirname, 'outputs', 'linestring.json'), output)
  const expected = loadJsonFile.sync(path.join(__dirname, 'outputs', 'linestring.json'))
  t.deepEqual(output, expected)
})

test('Distance parameter works', t => {
  const output = bufferGeoJSON(lineHarness, 2, 'kilometers')
  const dist = distance(point(lineHarness.geometry.coordinates[0]), point(output.geometry.coordinates[0][0]), {
    units: 'kilometers'
  })
  t.is(dist > 1.99999 && dist < 2.00001, true)
})

test('Units parameter works', t => {
  const output = bufferGeoJSON(lineHarness, 2, 'miles')
  const dist = distance(point(lineHarness.geometry.coordinates[0]), point(output.geometry.coordinates[0][0]), {
    units: 'miles'
  })
  t.is(dist > 1.99999 && dist < 2.00001, true)
})

test('Steps parameter works', t => {
  const segment = lineString([[0, 0], [0, 1]])
  const output = bufferGeoJSON(segment, 2, 'miles', 10)
  // Remembering that the fist & last point is duplicated in geojson
  t.is(output.geometry.coordinates[0].length, 21)
})
