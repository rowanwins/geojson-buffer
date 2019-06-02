const path = require('path')
const Benchmark = require('benchmark')
const buffer = require('../dist/geojson-buffer.js').bufferGeoJSON
const PolygonOffset = require('polygon-offset')
const jsts = require('jsts')
const loadJsonFile = require('load-json-file')

const options = {
    onStart (event) { console.log(this.name) },
    onError (event) { console.log(event.target.error) },
    onCycle (event) { console.log(String(event.target)) },
    onComplete () {
        console.log('- Fastest is ' + this.filter('fastest').map('name') + '\n')
    }
}

// const polygon = loadJsonFile.sync(path.join(__dirname, 'inputs', 'warsaw.json'))
const polygon = loadJsonFile.sync(path.join(__dirname, 'inputs', 'polyExample.json'))

// geojson-buffer x 1,655 ops/sec ±1.09% (91 runs sampled)
// polygon-offset x 328 ops/sec ±3.53% (89 runs sampled)
// jsts x 11,924 ops/sec ±4.22% (81 runs sampled)
// - Fastest is jsts
const suite = new Benchmark.Suite('buffer', options)
suite
    .add('geojson-buffer', function () {
        buffer(polygon, 1, 'miles')
    })
    .add('polygon-offset', function () {
        const offset = new PolygonOffset()
        offset.data(polygon.geometry.coordinates[0]).margin(1)
    })
    .add('jsts', function () {
        let geom = new jsts.io.GeoJSONReader().read(polygon)
        let spBuffer = geom.geometry.buffer(1, 32)
        new jsts.io.GeoJSONWriter().write(spBuffer)
    })
    .run()
