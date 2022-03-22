const Types = [
  'function',
  'date',
  'bignumber',
  'regexp',
  'set',
  'map',
  'symbol',
  'undefined',
].reduce((acc, cur) => {
  acc[cur] = `[@@EnhancerJSON/${cur.toUpperCase()}]`;
  return acc;
}, {});

function isISOString(param) {
  return typeof param === 'string' &&
    param.length === 24 &&
    param.endsWith('Z') &&
    (param[4] === '-') &&
    (param[7] === '-') &&
    (param[10] === 'T') &&
    (param[13] === ':') &&
    (param[16] === ':') &&
    (param[19] === '.') &&
    !isNaN(Date.parse(param));
};

function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  let proto = obj;

  while (Object.getPrototypeOf(proto) !== null) proto = Object.getPrototypeOf(proto);

  return Object.getPrototypeOf(obj) === proto;
};

function removeUselessProps(p) {
  if (!isPlainObject(p)) return p;

  return Reflect.ownKeys(p).reduce((acc, key) => {
    const val = p[key];

    if (val !== undefined && val !== null && !Number.isNaN(val)) acc[key] = removeUselessProps(val);

    return acc;
  }, {})
};

export function decodeJSON(param) {
  if (typeof param !== 'string') throw new Error('Non-strings cannot be parsed.');

  const regex = /(-?\d+){16,}(\.\d+)?/gm;

  const _innerParam = param.replaceAll(
    regex,
    function (p) {
      if (!Number.isSafeInteger(Number(p))) return `"${Types.bignumber + p}"`;

      return p;
    }
  ).replaceAll('""', '"');

  const result = JSON.parse(
    _innerParam,
    function (key, value) {
      if (value === null) return undefined;

      if (typeof value !== 'string') return value;

      if (value.startsWith(Types.function)) {
        return new Function('return ' + value.slice(Types.function.length))();
      }

      if (value.startsWith(Types.date)) {
        return new Date(Number(value.slice(Types.date.length)));
      }

      if (value.startsWith(Types.bignumber)) {
        return value.slice(Types.bignumber.length);
      }

      if (value.startsWith(Types.regexp)) {
        return new RegExp(...value.slice(Types.regexp.length).split(','));
      }

      if (value.startsWith(Types.set)) {
        return new Set(decodeJSON(value.slice(Types.set.length)));
      }

      if (value.startsWith(Types.map)) {
        return new Map(decodeJSON(value.slice(Types.map.length)));
      }

      if (value.startsWith(Types.symbol)) {
        return Symbol(value.slice(Types.symbol.length));
      }

      if (value.startsWith(Types.undefined)) {
        return undefined;
      }

      return value;
    });

  return removeUselessProps(result);
};

export function encodeJSON(p) {
  if (p === null || p === undefined || Number.isNaN(p)) throw new Error('Please check the encodeJSON function parameters: null, undefiend, and NaN are not allowed');

  const param = removeUselessProps(p);

  return JSON.stringify(param, function (key, value) {
    if (typeof value === 'function') return Types['function'] + value.toString();
    if (
      value === null ||
      value === undefined ||
      Number.isNaN(value)) return value = Types['undefined'] + 'undefined';
    if (isISOString(value)) return Types['date'] + Date.parse(value);

    if (typeof value === 'bigint') return String(value);

    if (value instanceof RegExp) return Types['regexp'] + String(value).split('/').splice(1).join(',');

    if (value instanceof Set) return Types['set'] + encodeJSON([...value]);

    if (value instanceof Map) return Types['map'] + encodeJSON([...value]);

    if (typeof value === 'symbol') return Types['symbol'] + value.description;
    return value;
  }, 2);
};


export default {
  decodeJSON,
  encodeJSON,
};