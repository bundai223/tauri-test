import { describe, expect, it } from 'vitest'
import { add } from './add'

it('adds two numbers', () => {
  expect(add()).toBe(0)
  expect(add(1)).toBe(1)
  expect(add(2, 2, 4)).toBe(8)
  expect(add(1, 2, 3, 4)).toBe(10)
})

describe('test simple array', () => {
  const results = [
    "hello",
    "helloはこんばんは",
    "ぼく3さい"
  ]

  it('配列のテスト', () => {
    expect(results).toContain("helloはこんばんは")
    expect(results).toContainEqual("hello")
  })
})

describe('test object array', () => {
  const random_age = Math.floor(Math.random() * 100)
  const results = [
    { eng: 'hello', ja: 'こんにちは'},
    { eng: "helloはこんばんは", ja: 'こんばんは' },
    { eng: `ぼく${random_age}さい`, ja: `僕は${random_age}歳です` }
  ]

  it('配列のテスト', () => {
    expect(results).toContainEqual({ eng: "hello", ja: "こんにちは" }) // toContainEqualはオブジェクトの中身
    expect(results).toContain(results[0]) // toContainはオブジェクトそのもの
    // expect(results).toContain({ eng: "hello", ja: "こんにちは" }) # これは赤

    expect(results[2]).toMatchObject({
      eng: expect.stringMatching(/^ぼく[0-9]*さい$/),
      ja: expect.stringMatching(/^僕は[0-9]*歳です$/),
    })
  })
})