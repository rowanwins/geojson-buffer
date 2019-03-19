import path from 'path'
import test from 'ava'
import { bufferGeoJSON } from '../src/main'
import loadJsonFile from 'load-json-file'
import write from 'write-json-file'

import { point, booleanPointInPolygon } from 'turf'

const polygonHarness = loadJsonFile.sync(path.join(__dirname, 'inputs', 'multipoly.json'))

test('MultiPolygon test', t => {
  const output = bufferGeoJSON(polygonHarness, 1, 'kilometers')
  t.is(output.type, 'Feature')
  t.is(output.geometry.type, 'MultiPolygon')

  t.is(booleanPointInPolygon(point(output.geometry.coordinates[0][0][0]), polygonHarness), false)
  t.is(booleanPointInPolygon(point(polygonHarness.geometry.coordinates[0][0][0]), output), true)

  if (process.env.REGEN) write.sync(path.join(__dirname, 'outputs', 'multipoly.json'), output)
  const expected = loadJsonFile.sync(path.join(__dirname, 'outputs', 'multipoly.json'))
  t.deepEqual(output, expected)
})
