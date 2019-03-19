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

test('Polygon edges test', t => {

    const firstPoint = points[0]
    const secondPoint = points[1]
    const thirdPoint = points[2]
    const forthPoint = points[3]
    const fifthPoint = points[4]
    const lastPoint = points[5]

    const firstEdge = edges[0]
    const secondEdge = edges[1]
    const thirdEdge = edges[2]
    const forthEdge = edges[3]
    const fifthEdge = edges[4]
    const lastEdge = edges[5]

    t.is(firstEdge.point1, firstPoint)
    t.is(firstEdge.point2, secondPoint)
    t.is(firstEdge.prevEdge, lastEdge)
    t.is(firstEdge.nextEdge, secondEdge)

    t.is(lastEdge.point1, lastPoint)
    t.is(lastEdge.point2, firstPoint)
    t.is(lastEdge.prevEdge, fifthEdge)
    t.is(lastEdge.nextEdge, firstEdge)

    t.is(secondEdge.point1, secondPoint)
    t.is(secondEdge.point2, thirdPoint)
    t.is(secondEdge.prevEdge, firstEdge)
    t.is(secondEdge.nextEdge, thirdEdge)

    t.is(thirdEdge.point1, thirdPoint)
    t.is(thirdEdge.point2, forthPoint)
    t.is(thirdEdge.prevEdge, secondEdge)
    t.is(thirdEdge.nextEdge, forthEdge)

    t.is(forthEdge.point1, forthPoint)
    t.is(forthEdge.point2, fifthPoint)
    t.is(forthEdge.prevEdge, thirdEdge)
    t.is(forthEdge.nextEdge, fifthEdge)

    t.is(fifthEdge.point1, fifthPoint)
    t.is(fifthEdge.point2, lastPoint)
    t.is(fifthEdge.prevEdge, forthEdge)
    t.is(fifthEdge.nextEdge, lastEdge)
})
