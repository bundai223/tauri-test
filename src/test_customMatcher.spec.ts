import { describe, expect, expectTypeOf, it } from 'vitest'
import { add } from './add'

expect.extend({
  toBeFoo(received, expected) {
    const { isNot } = this
    return {
      // do not alter your "pass" based on isNot. Vitest does it for you
      pass: received === 'foo',
      message: () => `${received} is${isNot ? '' : ' not'} foo`
    }
  }
})

describe('test simple array', () => {
  const results = [
    "foo",
    "bar",
    "ぼく3さい"
  ]

  it('配列のテスト', () => {
    expect(results[0]).toBeFoo()
    expect(results[1]).toBeBar()
  })
})

describe('test object array', () => {
  const random_age = Math.floor(Math.random() * 100)
  const results = [
    { id: 1, eng: 'hello', ja: 'こんにちは'},
    { id: 2, eng: "helloはこんばんは", ja: 'こんばんは' },
    { id: 3, eng: `ぼく${random_age}さい`, ja: `僕は${random_age}歳です` }
  ]

  // ref: expect.arrayContaining https://vitest.dev/api/expect.html#expect-arraycontaining
  // ref: expect.objectContaining https://vitest.dev/api/expect.html#expect-objectcontaining
  it('配列のテスト', () => {
    expect(results).toContainEqual({ id: 1, eng: "hello", ja: "こんにちは" }) // toContainEqualはオブジェクトの中身
    expect(results).toContain(results[0]) // toContainはオブジェクトそのもの
    // expect(results).toContain({ eng: "hello", ja: "こんにちは" }) # これは赤

    expect(results[2]).toMatchObject({
      id: 3,
      eng: expect.stringMatching(/^ぼく[0-9]*さい$/),
      ja: expect.stringMatching(/^僕は[0-9]*歳です$/),
    })

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          eng: expect.stringMatching(/^ぼく[0-9]*さい$/),
          ja: expect.stringMatching(/^僕は[0-9]*歳です$/),
        })
      ])
    )
  })
})