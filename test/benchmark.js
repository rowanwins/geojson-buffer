const path = require('path')
const Benchmark = require('benchmark')
const buffer = require('../dist/geojson-buffer').bufferGeoJSON
const PolygonOffset = require('polygon-offset')
const jsts = require('jsts')
const loadJsonFile = require('load-json-file')

const options = {
  onStart(event) {
    console.log(this.name)
  },
  onError(event) {
    console.log(event.target.error)
  },
  onCycle(event) {
    console.log(String(event.target))
  },
  onComplete() {
    console.log('- Fastest is ' + this.filter('fastest').map('name') + '\n')
  }
}

const polygon = loadJsonFile.sync(
  path.join(__dirname, 'inputs', 'polygon.json')
)

const suite = new Benchmark.Suite('buffer', options)
suite
  .add('geojson-buffer', function() {
    buffer(polygon, 1, 'miles')
  })
  .add('polygon-offset', function() {
    const offset = new PolygonOffset()
    offset.data(polygon.geometry.coordinates[0]).margin(1)
  })
  .add('jsts', function() {
    let geom = new jsts.io.GeoJSONReader().read(polygon)
    let spBuffer = geom.geometry.buffer(1)
    new jsts.io.GeoJSONWriter().write(spBuffer)
  })
  .run()
