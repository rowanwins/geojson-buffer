import test from 'ava'
import { setupStructures } from '../src/setupStructures'
import loadJsonFile from 'load-json-file'
import path from 'path'

const poly = loadJsonFile.sync(path.join(__dirname, 'inputs', 'polygonBasic.json'))
const contour = setupStructures(poly)[0]

test('Contour test', t => {
    const points = contour.points
    const edges = contour.edges

    t.is(edges.length, 6)
    t.is(points.length, 6)
})

test('Contour offset', t => {
    const edges = contour.edges
    t.is(edges[0].offsetPoint1, null)

    contour.offsetEdges(1)

    // t.is(edges[0].offsetPoint1.x, -0.7732490689395508)
    // t.is(edges[0].offsetPoint1.y, -0.2787848328747291)

})
