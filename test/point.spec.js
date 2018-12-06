import path from 'path'
import test from 'ava'
import { bufferGeoJSON } from '../src/main'
import loadJsonFile from 'load-json-file'
import { distance, point } from 'turf'

const p = loadJsonFile.sync(path.join(__dirname, 'inputs') + '/point.json')

test('Point test -- expected outputs', t => {
  const output = bufferGeoJSON(p, 1, 'kilometers')
  t.is(output.type, 'Feature')
  t.is(output.geometry.type, 'Polygon')

  const expected = loadJsonFile.sync(path.join(__dirname, 'outputs') + '/point.json')
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

  const dist2 = distance(northernPoint, point(output.geometry.coordinates[0][30]), {
    units: 'kilometers'
  })
  t.is(dist2 > 0.99999 && dist2 < 1.00001, true)
})
