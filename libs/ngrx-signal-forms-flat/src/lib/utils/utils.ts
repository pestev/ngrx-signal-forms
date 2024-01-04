import { NgrxSignalFormControlValue } from '../types/ngrx-signal-forms.types';

export function isObject(v: unknown): v is object {

  return Boolean(v) && typeof v === 'object' && !Array.isArray(v);
}

export function isPrimitive(v: unknown): v is NgrxSignalFormControlValue {

  return v == null || [ 'string', 'number', 'bigint', 'boolean' ].includes(typeof v);
}

// export function arrayEquals(a: Array<unknown>, b: Array<unknown>): boolean {
//   return a.length === b.length && a.every((e, index) => e === b[index]);
// }
