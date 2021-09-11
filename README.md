# json-enhancer

Extension JavaScript native parser for ES new features.

[![Build Status](https://travis-ci.com/NickLJudy/json-enhancer.svg?branch=main)](https://travis-ci.com/NickLJudy/json-enhancer)
[![Version](https://img.shields.io/npm/v/json-enhancer.svg?maxAge=300&label=version&colorB=007ec6&maxAge=300)](./package.json)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/json-enhancer)](https://bundlephobia.com/package/json-enhancer)
![dependencies-logo](https://status.david-dm.org/gh/NickLJudy/json-enhancer.svg)
![last-commit-date-logo](https://img.shields.io/github/last-commit/NickLJudy/json-enhancer)
<!-- [![Coverage Status](https://coveralls.io/repos/github/NickLJudy/json-enhancer/badge.svg)](https://coveralls.io/github/NickLJudy/json-enhancer) -->
## Installation

The json-enhancer package lives in [npm](https://www.npmjs.com/get-npm). To install the latest stable version, run the following command:

```shell
npm i json-enhancer
```

Or if you're using [yarn](https://classic.yarnpkg.com/en/docs/install/):

```shell
yarn add json-enhancer
```

## Usage

```js
import {decodeJSON, encodeJSON} from 'json-enhancer';

/* big number */
decodeJSON('9007199254740997')  //'9007199254740997'

/* date */
const d = new Date()
const dCopy = decodeJSON(encodeJSON(d));

dCopy.toISOString() === d.toISOString();  //true

/* Omit null, undefined, NaN */
const obj = {
    prop0:0,
    prop1:null,
    prop2:undefined,
    prop3:NaN,
};

decodeJSON(encodeJSON(obj)) //{prop0: 0}

/* Regular expression */
const reg = new RegExp('ab+c', 'i');
const regCopy = decodeJSON(encodeJSON(reg));

reg.toString() === regCopy.toString() //true
regCopy instanceof RegExp //true

/* bigint */
const b = 10n;
const obj = {b};

decodeJSON(encodeJSON(obj));  //{b: '10'}

/* Set */
const b = 10n;
const s = new Set([b,'a',1,'10',2,10,]);

decodeJSON(encodeJSON(s));  //Set(5) {'10', 'a', 1, 2, 10}

/* Symbol */
const sym = Symbol('foo');
const obj = {sym};

decodeJSON(encodeJSON(obj));  //{sym: Symbol(foo)}

```

## Objective

Solve the problem of **big number** precision loss, using string representation.

**Methods** in an object are not lost after parsing.

**Date** objects are typed unchanged after parsing.

If the value of plain object is **null** / **undefiend** / **NaN**, it will be discarded.

**Regular expression** parsing is supported.

**Bigint** parsing is supported, using string representation.

Support **Set** data type resolution.
* If the set contains bigInt, json-enhancer parses the value as a numeric string. If the set contains the same numeric string, only one value is retained.

**Symbol** is passed to json-enhancer as a value that will be redeclared after parsing.

## Notice

Map, WeakMap and WeakSet will not be handled.

Symbol as the key in the plain object will be omitted.