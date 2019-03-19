import test from 'ava'
import Point from '../src/Point'
import Edge from '../src/Edge'

test('Edge test', t => {
    const p1 = new Point([0, 0])
    const p2 = new Point([10, 0])

    const e = new Edge(p1, p2)
    t.is(e.point1, p1)
    t.is(e.point2, p2)
    e.offsetEdge(10)

    t.is(e.offsetPoint1.x, 0)
    t.is(e.offsetPoint1.y, -10)
    t.is(e.offsetPoint2.x, 10)
    t.is(e.offsetPoint2.y, -10)

})
