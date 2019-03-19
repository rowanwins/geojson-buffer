import test from 'ava'
import Point from '../src/Point'

test('Point test', t => {
    const p = new Point([0, 0])

    t.is(p.x, 0)
    t.is(p.y, 0)
    t.is(p.radiansX, 0)
    t.is(p.radiansY, 0)
    t.is(p.nextPoint, null)
    t.is(p.prevPoint, null)
})

test('Point x/y to radians', t => {
    const p = new Point([52.205, 0.119])

    t.is(p.radiansX, 0.9111491360036397)
    t.is(p.radiansY, 0.0020769418098732523)
})

test('Point relationships - convex points', t => {
    const p = new Point([0, -10])

    const prevPoint = new Point([-10, 0])
    const nextPoint = new Point([10, 10])

    p.prevPoint = prevPoint
    p.nextPoint = nextPoint

    p.calcuateAnglesBetweeenPoints()

    t.is(p.bearingPrevPoint, -45.438548586742314)
    t.is(p.bearingNextPoint, 26.740205355727124)
    t.is(p.angleBetweenPoints, 72.17875394246943)
    t.false(p.isConcave)
})

test('Point relationships - flat points', t => {
    const p = new Point([0, 0])

    const prevPoint = new Point([-10, 0])
    const nextPoint = new Point([10, 0])

    p.prevPoint = prevPoint
    p.nextPoint = nextPoint

    p.calcuateAnglesBetweeenPoints()
    t.is(p.bearingPrevPoint, -90)
    t.is(p.bearingNextPoint, 90)
    t.is(p.angleBetweenPoints, 180)
    t.false(p.isConcave)
})

test('Point relationships - concave points', t => {
    const p = new Point([0, 10])

    const prevPoint = new Point([-10, 0])
    const nextPoint = new Point([10, 0])

    p.prevPoint = prevPoint
    p.nextPoint = nextPoint

    p.calcuateAnglesBetweeenPoints()

    t.is(p.bearingPrevPoint, -134.5614514132577)
    t.is(p.bearingNextPoint, 134.5614514132577)
    t.is(p.angleBetweenPoints, 269.1229028265154)
    t.true(p.isConcave)
})
