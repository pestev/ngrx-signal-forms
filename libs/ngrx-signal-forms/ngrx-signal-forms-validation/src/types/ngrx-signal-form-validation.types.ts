import { BaseControl, Primitive } from '../../../src/lib/types/ngrx-signal-form.types';

export type ValidatorFn = <TFormState>(
  controlState: BaseControl,
  formState: TFormState
) => Record<string, unknown>

export type ValidatorConfig<TFormValue> =
  TFormValue extends Primitive
  ? ValidatorFn
  : TFormValue extends Array<infer E>
    ? ValidatorConfig<E>
    : TFormValue extends object
      ? { [K in keyof TFormValue & string]?: ValidatorConfig<TFormValue[K]> }
      : never;

// ***** Tests ***** //

// function test<TFormValue>(config: {
//   value: TFormValue,
//   validators: ValidatorConfig<TFormValue>
// }) {
//   //
// }
//
// const emptyValidator: ValidatorFn = () => ({});
//
// // test empty validators for object value
// test({
//   value: { a: 'a' },
//   validators: {}
// });
//
// // test primitive value
// test({
//   value: 'a',
//   validators: emptyValidator
// });
//
// // test object value
// test({
//   value: { a: 'a' },
//   validators: {
//     a: emptyValidator
//   }
// });
//
// // test array with primitive value
// test({
//   value: [ 'a' ],
//   validators: emptyValidator
// });
//
// // test array with object value
// test({
//   value: [ { a: 'a' } ],
//   validators: {
//     a: emptyValidator
//   }
// });
//
// // test object containing array value
// test({
//   value: { a: [ 'b' ] },
//   validators: {
//     a: emptyValidator
//   }
// });
//
// // test example complex value
// const complexValue = {
//   name: 'MyFirstName',
//   surname: 'MySecondName',
//   address: {
//     street: 'My street',
//     city: 'My city'
//   },
//   items: [
//     {
//       itemId: 1,
//       itemName: 'Item number 1'
//     },
//     {
//       itemId: 2,
//       itemName: 'Item number 2'
//     }, {
//       itemId: 3,
//       itemName: 'Item number 3'
//     }
//   ]
// };
//
// test({
//   value: complexValue,
//   validators: {
//     name: emptyValidator,
//     items: {
//       itemName: emptyValidator
//     }
//   }
// });
