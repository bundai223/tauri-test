import { expect, it } from 'vitest'
import { add } from './add'

it('adds two numbers', () => {
  expect(add()).toBe(0)
  expect(add(1)).toBe(1)
  expect(add(2, 2, 4)).toBe(8)
  expect(add(1, 2, 3, 4)).toBe(10)
})