import test from 'ava'
import Point from '../src/Point'
import { destination, lengthToRadians } from '../src/utils'

test('Destination test', t => {
    const p1 = new Point([0, 0])
    const radiansDistance = lengthToRadians(10, 'degrees')
    const bearing = 90

    const outP = destination(p1, radiansDistance, bearing)
    t.is(outP.x, 10)
    t.is(outP.y, 6.09219391454593e-16)
})
