import { decodeJSON, encodeJSON } from './index';

describe('decodeJSON', () => {
  test('big number', () => {
    expect(decodeJSON('9007199254740997')).toBe('9007199254740997');
    expect(decodeJSON('9007199254740997.1')).toBe('9007199254740997.1');
  });

  test('The argument to the parse function must be a string', () => {
    expect(() => decodeJSON(123)).toThrow();
  });

});

describe('encodeJSON', () => {
  test('null | undefined | NaN', () => {
    expect(() => encodeJSON(null)).toThrow();
    expect(() => encodeJSON(undefined)).toThrow();
    expect(() => encodeJSON(NaN)).toThrow();
  });
});

describe('combination:encodeJSON + decodeJSON', () => {
  test('date', () => {
    const d = new Date();
    const dCopy = decodeJSON(encodeJSON(d));

    expect(dCopy.toISOString()).toBe(d.toISOString());
  });

  test('Omit null, undefined, NaN', () => {
    const obj = {
      prop0: 0,
      prop1: null,
      prop2: undefined,
      prop3: NaN,
    };
    const targetObj = { prop0: 0 };
    expect(
      decodeJSON(encodeJSON(obj))
    ).toEqual(targetObj);
  });

  test('Regular expression', () => {
    const reg = new RegExp('ab+c', 'i');
    const regCopy = decodeJSON(encodeJSON(reg));

    expect(reg.toString() === regCopy.toString()).toBeTruthy();
    expect(regCopy instanceof RegExp).toBeTruthy();
  });

  test('bigint', () => {
    const b = 10n;
    const obj = { b };
    const targetObj = { b: '10' };

    expect(
      decodeJSON(encodeJSON(obj))
    ).toEqual(targetObj);
  });

  test('Set', () => {
    const b = 10n;
    const s = new Set([b, 'a', 1, '10', 2, 10,]);
    const targetS = new Set(['10', 'a', 1, 2, 10]);

    expect(
      decodeJSON(encodeJSON(s))
    ).toEqual(targetS);
  });

  test('Symbol as value', () => {
    const sym = Symbol('foo');
    const obj = { sym };
    const objCopy = decodeJSON(encodeJSON(obj));

    expect(
      objCopy.description
    ).toBe(obj.description);

    expect(
      typeof objCopy.sym
    ).toBe('symbol');

    expect(
      objCopy
    ).not.toEqual(obj);
  });

  test('obj method', () => {
    const fn = function (m, n) { return m + n };
    const obj = { fn };
    const objCopy = decodeJSON(encodeJSON(obj));

    expect(typeof objCopy.fn === 'function').toBeTruthy();
    expect(objCopy.fn(1, 2)).toBe(3);
  })

  test('should ', () => {
    const bigNumStr = 9007199254740990;
    const bigNumDecimalStr = '9007199254740997.2';
    const obj = { bigNumStr, bigNumDecimalStr};
    const objCopy = decodeJSON(encodeJSON(obj));

    expect(obj.bigNumStr).toBe(objCopy.bigNumStr);
    expect(obj.bigNumDecimalStr).toBe(objCopy.bigNumDecimalStr);
  })

});