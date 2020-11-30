import * as types from './type'

type NamedParam = {
  name: string
}

type StrictParam = NamedParam & {
  strict?: boolean
}

type NumberParam = StrictParam & {
  lt?: number
  lte?: number
  gt?: number
  gte?: number
}

type StringParam = StrictParam & {
  alpha?: boolean
  numeric?: boolean
}

type CustomParam = StrictParam & {
  message?: string
}

export function notNull(value: any, {name}: NamedParam) {
  if (types.isNull(value)) {
    throw new Error(`IllegalArgument: ${name} is null or undefined`)
  }
}

export function isBoolean(value: boolean, {name, strict = true}: StrictParam) {
  if (strict) notNull(value, {name})
  if (!types.isBoolean(value)) {
    throw new Error(`IllegalType: ${name} is not a boolean`)
  }
}

export function isNumber(value: any, {name, strict = true, lt, lte, gt, gte}: NumberParam) {
  if (strict) notNull(value, {name})
  if (!types.isNumber(value)) {
    throw new Error(`IllegalArgument: ${name} is not a number`)
  }
  if (!types.isNull(lt)) isLessThen(value, lt, {name})
  else if (!types.isNull(lte)) isLessThenOrEqual(value, lt, {name})
  else if (!types.isNull(gt)) isGreaterThenOrEqual(value, lt, {name})
  else if (!types.isNull(gte)) isGreaterThen(value, lt, {name})
}

export function isInteger(value: any, {name, strict = true, lt, lte, gt, gte}: NumberParam) {
  if (strict) notNull(value, {name})
  if (!types.isInteger(value)) {
    throw new Error(`IllegalArgument: ${name} is not an integer`)
  }
  if (!types.isNull(lt)) isLessThen(value, lt, {name})
  else if (!types.isNull(lte)) isLessThenOrEqual(value, lte, {name})
  else if (!types.isNull(gt)) isGreaterThen(value, gt, {name})
  else if (!types.isNull(gte)) isGreaterThenOrEqual(value, gte, {name})
}

export function isLessThen(value: any, limit: number, {name}: NamedParam) {
  if (!(value < limit)) {
    throw new Error(`IllegalArgument: ${name} must be < ${limit}`)
  }
}

export function isLessThenOrEqual(value: any, limit: number, {name}: NamedParam) {
  if (!(value <= limit)) {
    throw new Error(`IllegalArgument: ${name} must be <= ${limit}`)
  }
}

export function isGreaterThen(value: any, limit: number, {name}: NamedParam) {
  if (!(value > limit)) {
    throw new Error(`IllegalArgument: ${name} must be > ${limit}`)
  }
}

export function isGreaterThenOrEqual(value: any, limit: number, {name}: NamedParam) {
  if (!(value >= limit)) {
    throw new Error(`IllegalArgument: ${name} must be >= ${limit}`)
  }
}

export function isString(value: any, {name, strict = true, alpha, numeric}: StringParam) {
  if (strict) notNull(value, {name})
  if (!types.isString(value)) {
    throw new Error(`IllegalArgument: ${name} is not a string`)
  }
  if (alpha && numeric) isAlphanumeric(value, {name})
  else if (alpha) isAlpha(value, {name})
  else if (numeric) isNumeric(value, {name})
}

export function isAlphanumeric(value: any, {name}: NamedParam) {
  if (!/^[a-z0-9]+$/i.test(value)) {
    throw new Error(`IllegalArgument: ${name} is not alphanumeric`)
  }
}

export function isAlpha(value: any, {name}: NamedParam) {
  if (!/^[a-z]+$/i.test(value)) {
    throw new Error(`IllegalArgument: ${name} is not alphabetic`)
  }
}

export function isNumeric(value: any, {name}: NamedParam) {
  if (!/^[0-9]+$/.test(value)) {
    throw new Error(`IllegalArgument: ${name} is not numeric`)
  }
}

export function isArray(value: any, {name, strict = true}: StrictParam) {
  if (strict) notNull(value, {name})
  if (!types.isArray(value)) {
    throw new Error(`IllegalArgument: ${name} is not an array`)
  }
}

export function isObject(value: any, {name, strict = true}: StrictParam) {
  if (strict) notNull(value, {name})
  if (!types.isObject(value)) {
    throw new Error(`IllegalArgument: ${name} is not an object`)
  }
}

export function isEnumValue(value: any, enumeration: Record<string, any>, {name, strict = true}: StrictParam) {
  if (strict) notNull(value, {name})
  const values = new Set(Object.values(enumeration))
  if (!values.has(value)) {
    throw new Error(
      `IllegalArgument: ${name} should be one of [${Array.from(values, value => JSON.stringify(value)).join(', ')}]`,
    )
  }
}

export function instanceOf(value: any, ctor: new (...args: any) => any, {name, strict = true}: StrictParam) {
  if (strict) notNull(value, {name})
  if (!types.instanceOf(value, ctor)) {
    throw new Error(`IllegalType: ${name} is not an instance of ${ctor.name}`)
  }
}

export function custom(value: any, check: (value: any) => boolean, {name, strict = true, message}: CustomParam) {
  if (strict) notNull(value, {name})
  if (!check(value)) {
    throw new Error(`IllegalType: ${name} ${message || 'is unknown type'}`)
  }
}
