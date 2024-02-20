import { Primitive } from '../types/ngrx-signal-form.types';

/**
 * Check if provided value is object
 */
export function isObject(v: unknown): v is object {

  return Boolean(v) && typeof v === 'object' && !Array.isArray(v);
}

/**
 * Check if provided value is string/number/boolean
 */
export function isPrimitive(v: unknown): v is Primitive {

  return v == null || [ 'string', 'number', 'bigint', 'boolean' ].includes(typeof v);
}

/**
 * Compare two array and return true if all elements in both arrays are strictly same
 */
export function arrayEquals(a: Array<unknown>, b: Array<unknown>): boolean {
  return a.length === b.length && a.every((e, index) => e === b[index]);
}

/**
 * If provided value is not array, then return this value wrapped to array
 */
export function ensureArray<T>(v: T | T[]): T[] {

  return Array.isArray(v) ? v : [ v ];
}

/**
 * Check if provided value has length property with number type
 */
export function hasValidLength<TValue extends { length?: unknown }>(
  value: TValue
): value is TValue & { length: number } {

  return value != null && typeof value.length === 'number';
}

/**
 * Checks if provided value is empty. Works for arrays, objects and for other values checks falsy
 */
export function isEmpty(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (isObject(value)) {
    return Object.keys(value).length === 0;
  }

  return !value;
}
