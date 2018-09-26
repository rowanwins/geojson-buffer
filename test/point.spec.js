import test from 'ava'
import { bufferGeoJSON } from '../src/main'
import { point } from './harness/point'
import { point as expected } from './outputs/point'

test('Point test', t => {
  const output = bufferGeoJSON(point, 1, 'kilometers')
  t.is(output.type, 'Feature')
  t.is(output.geometry.type, 'Polygon')
  t.deepEqual(output, expected)
})
