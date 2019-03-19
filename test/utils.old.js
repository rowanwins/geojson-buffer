import test from 'ava'
import { getInverseDistance } from '../src/utils'

test('Inverting test', t => {
  const inverted = getInverseDistance(1)
  t.is(inverted, -1)

  const inverted2 = getInverseDistance(-1)
  t.is(inverted2, 1)
})

test('Inverting test with decimals', t => {
  const inverted = getInverseDistance(1.00001)
  t.is(inverted, -1.00001)

  const inverted2 = getInverseDistance(-1.00001)
  t.is(inverted2, 1.00001)
})
