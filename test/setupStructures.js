import test from 'ava'
import { setupStructures } from '../src/setupStructures'
import loadJsonFile from 'load-json-file'
import path from 'path'

const poly = loadJsonFile.sync(path.join(__dirname, 'inputs', 'polygonBasic.json'))

const contours = setupStructures(poly)
const points = contours[0].points
const edges = contours[0].edges

test('Polygon has right edges & points length', t => {

    t.is(contours.length, 1)
    t.false(contours[0].isHole)

    t.is(edges.length, 6)
    t.is(points.length, 6)
})

test('Polygon points test', t => {

    const firstPoint = points[0]
    t.is(firstPoint.x, 3.515625)
    t.is(firstPoint.y, 8.754794702435618)

    const secondPoint = points[1]
    t.is(secondPoint.x, 11.6015625)
    t.is(secondPoint.y, 4.915832801313164)

    const thirdPoint = points[2]
    t.is(thirdPoint.x, 16.5234375)
    t.is(thirdPoint.y, 5.61598581915534)

    const forthPoint = points[3]
    t.is(forthPoint.x, 19.335937499999996)
    t.is(forthPoint.y, 8.754794702435618)

    const fifthPoint = points[4]
    t.is(fifthPoint.x, 28.4765625)
    t.is(fifthPoint.y, 13.239945499286312)

    const lastPoint = points[5]
    t.is(lastPoint.x, 20.390625)
    t.is(lastPoint.y, 19.973348786110602)
})
