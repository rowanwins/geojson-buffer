import test from 'ava'
import { bufferGeoJSON } from '../src/main'
import { polygon } from './harness/polygon'
import { polygon as expected } from './outputs/polygon'

test('Polygon test', t => {
  const output = bufferGeoJSON(polygon, 1, 'kilometers')
  t.is(output.type, 'Feature')
  t.is(output.geometry.type, 'Polygon')
  t.deepEqual(output, expected)
})
