const buffer = require('./dist/geojson-buffer.js').bufferGeoJSON
const jsts = require('jsts')
const loadJsonFile = require('load-json-file')
const path = require('path')

const warsaw = loadJsonFile.sync(path.join(__dirname, 'test', 'inputs', 'warsaw.json'))
console.log(warsaw.geometry.coordinates[0].length)
// const polygon = loadJsonFile.sync(path.join(__dirname, 'test', 'inputs', 'polyCreatesHole.json'))

// const polygon2 = loadJsonFile.sync(path.join(__dirname, 'test', 'inputs', 'polyCreatesHole.json'))

var hrstart3 = process.hrtime()
let geom1 = new jsts.io.GeoJSONReader().read(warsaw)
let spBuffer1 = geom1.geometry.buffer(1, 32)
const out3 = new jsts.io.GeoJSONWriter().write(spBuffer1)
var hrend3 = process.hrtime(hrstart3)
console.info('Execution time (hr): %ds %dms', hrend3[0], hrend3[1] / 1000000)

var hrstart = process.hrtime()
const out12 = buffer(warsaw, 1000, 'meters')
var hrend = process.hrtime(hrstart)
console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
