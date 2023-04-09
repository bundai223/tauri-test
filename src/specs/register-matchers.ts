import { expect } from "vitest"

expect.extend({
  toBeBar(received, expected) {
    const { isNot } = this
    return {
      // do not alter your "pass" based on isNot. Vitest does it for you
      pass: received === 'bar',
      message: () => `${received} is${isNot ? '' : ' not'} bar`
    }
  }
})