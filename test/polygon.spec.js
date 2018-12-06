import path from 'path'
import test from 'ava'
import { bufferGeoJSON } from '../src/main'
import loadJsonFile from 'load-json-file'

test('Polygon test', t => {
  const output = bufferGeoJSON(loadJsonFile.sync(path.join(__dirname, 'inputs') + '/polygon.json'), 1, 'kilometers')
  t.is(output.type, 'Feature')
  t.is(output.geometry.type, 'Polygon')
  t.deepEqual(output, loadJsonFile.sync(path.join(__dirname, 'outputs') + '/polygon.json'))
})
