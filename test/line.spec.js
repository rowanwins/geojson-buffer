import path from 'path'
import test from 'ava'
import { bufferGeoJSON } from '../src/main'
import loadJsonFile from 'load-json-file'
import write from 'write-json-file'

import { point, lineString, distance } from 'turf'

const lineHarness = loadJsonFile.sync(
  path.join(__dirname, 'inputs', 'linestring.json')
)
const lineTouchingHarness = loadJsonFile.sync(
  path.join(__dirname, 'inputs', 'linestringTouching.json')
)
const multiLineHarness = loadJsonFile.sync(
  path.join(__dirname, 'inputs', 'multiline.json')
)

test('Polyline test', t => {
  const output = bufferGeoJSON(lineHarness, 1, 'kilometers')
  t.is(output.type, 'Feature')
  t.is(output.geometry.type, 'Polygon')

  if (process.env.REGEN)
    write.sync(path.join(__dirname, 'outputs', 'linestring.json'), output)
  const expected = loadJsonFile.sync(
    path.join(__dirname, 'outputs', 'linestring.json')
  )
  t.deepEqual(output, expected)
})

test('MultiLine test', t => {
  const output = bufferGeoJSON(multiLineHarness, 1, 'kilometers')
  t.is(output.type, 'Feature')
  t.is(output.geometry.type, 'MultiPolygon')

  if (process.env.REGEN)
    write.sync(path.join(__dirname, 'outputs', 'multiLineHarness.json'), output)
  const expected = loadJsonFile.sync(
    path.join(__dirname, 'outputs', 'multiLineHarness.json')
  )
  t.deepEqual(output, expected)
})

test('Polyline touching test', t => {
  const output = bufferGeoJSON(lineTouchingHarness, 10, 'kilometers')
  t.is(output.type, 'Feature')
  t.is(output.geometry.type, 'Polygon')

  if (process.env.REGEN)
    write.sync(
      path.join(__dirname, 'outputs', 'linestringTouching.json'),
      output
    )
  const expected = loadJsonFile.sync(
    path.join(__dirname, 'outputs', 'linestringTouching.json')
  )
  t.deepEqual(output, expected)
})

test('Distance parameter works', t => {
  const output = bufferGeoJSON(lineHarness, 2, 'kilometers')
  const dist = distance(
    point(lineHarness.geometry.coordinates[0]),
    point(output.geometry.coordinates[0][6]),
    {
      units: 'kilometers'
    }
  )
  t.is(dist > 1.95 && dist < 2.05, true)
})

test('Units parameter works', t => {
  const output = bufferGeoJSON(lineHarness, 2, 'miles')
  const dist = distance(
    point(lineHarness.geometry.coordinates[0]),
    point(output.geometry.coordinates[0][6]),
    {
      units: 'miles'
    }
  )
  t.is(dist > 1.95 && dist < 2.05, true)
})

test('Steps parameter works', t => {
  const segment = lineString([[0, 0], [0, 1]])
  const output = bufferGeoJSON(segment, 2, 'miles', 10)
  // Number of points depends on angles
  t.is(output.geometry.coordinates[0].length, 43)
})
