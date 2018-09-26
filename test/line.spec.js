import test from 'ava'
import { bufferGeoJSON } from '../src/main'
import { linestring } from './harness/linestring'
import { linestring as expected } from './outputs/linestring'

test('Linestring test', t => {
  const output = bufferGeoJSON(linestring, 1, 'kilometers')
  t.is(output.type, 'Feature')
  t.is(output.geometry.type, 'Polygon')
  t.deepEqual(output, expected)
})
