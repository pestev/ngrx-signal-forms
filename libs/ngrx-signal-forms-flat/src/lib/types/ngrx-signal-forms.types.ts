export type NgrxSignalFormControlValue = string | number | boolean | null | undefined;

export interface NgrxSignalFormControl<TValue> {
  id: string;
  isDirty: boolean;
  isDisabled: boolean;
  hasErrors: boolean;
  value: TValue;
}

// export type NgrxSignalForm<TPath extends string, TValue> =
//   TValue extends NgrxSignalFormControlValue
//   ? NgrxSignalFormControl<TValue>
//   : TValue extends object | ArrayLike<unknown>
//     ? { [K in keyof TValue as `${ TPath }.${ K }`]: NgrxSignalForm<TPath, TValue[K]> }
//     : never;

export type NgrxSignalForm<TPath extends string, TValue> =
  TValue extends NgrxSignalFormControlValue
  ? NgrxSignalFormControl<TValue>
  : TValue extends Array<infer Element>
    ? { [Idx in keyof TValue & number as `${ TPath }.${ Idx }`]: NgrxSignalForm<`${ TPath }.${ Idx }`, Element> }
    : TValue extends object
      ? { [Key in keyof TValue as `${ TPath }.${ Key & string }`]: NgrxSignalForm<`${ TPath }.${ Key & string }`, TValue[Key]> }
      : never;

// function test<TPath extends string, TValue>(
//   path: TPath,
//   value: TValue
// ): NgrxSignalForm<TPath, TValue> {
//
//   return {} as any;
// }
//
// const primitive = test('exampleBasePath', 'value');
//
// const simpleArray = test('exampleBasePath', [ 'value1', 'value2' ]);
// const simpleArray0 = simpleArray['exampleBasePath.0'];
//
// const simpleObject = test('exampleBasePath', { a: 'value1', b: 'value2' });
// const simpleObject0 = simpleObject['exampleBasePath.a'];
