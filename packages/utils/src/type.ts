export function isNull(value: any): value is null | undefined {
  return value == null
}

export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean' || value instanceof Boolean
}

export function isString(value: any): value is string {
  return Object.prototype.toString.call(value) === '[object String]'
}

export function isNumber(value: any): value is number {
  return typeof value === 'number' || value instanceof Number
}

export function isInteger(value: any): value is number {
  return isNumber(value) && Number.isInteger(value)
}

export function isArray(value: any): value is any[] {
  return Array.isArray(value)
}

export function isObject(value: any): value is Record<PropertyKey, any> {
  return typeof value === 'object' && value !== null
}

export function isFunction(value: any): value is (...args: any[]) => any {
  return typeof value === 'function'
}

export function isEnumValue<TEnum extends Record<string, string | number>, TValues extends TEnum[keyof TEnum]>(
  value: any,
  enumeration: TEnum,
): value is TValues {
  const values = new Set(Object.values(enumeration))
  return values.has(value)
}

export function has<TKey extends PropertyKey>(
  value: any,
  keys: TKey | readonly TKey[],
): value is Record<TKey, unknown> {
  if (!isObject(value)) return false

  if (!isArray(keys)) keys = [keys as TKey]

  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) {
      return false
    }
  }

  return true
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function instanceOf<TCtor extends Function>(value: any, ctor: TCtor): value is TCtor['prototype'] {
  return value instanceof ctor
}
