// ngrx-signal-forms-generator.test.ts

import { generate, generateArray, generateObject, generatePrimitive } from './ngrx-signal-forms-generator';

describe('ngrx-signal-forms-generator', () => {

  test('generatePrimitive should return NgrxSignalForm', () => {
    const actual = generatePrimitive('testFormName', 'value');
    expect(actual).toEqual({
      testFormName: {
        id: 'testFormName',
        isDirty: false,
        isDisabled: false,
        hasErrors: false,
        value: 'value'
      }
    });
  });

  test('generateObject should convert object to NgrxSignalForm', () => {
    const actual = generateObject('testFormName', { a: 'value' });
    expect(actual).toEqual({
      'testFormName.a': {
        id: 'testFormName.a',
        isDirty: false,
        isDisabled: false,
        hasErrors: false,
        value: 'value'
      }
    });
  });

  test('generateArray should convert array to NgrxSignalForm', () => {
    const actual = generateArray('testFormName', [ 'value' ]);
    expect(actual).toEqual({
      'testFormName.0': {
        id: 'testFormName.0',
        isDirty: false,
        isDisabled: false,
        hasErrors: false,
        value: 'value'
      }
    });
  });

  test('generate should convert primitive values to NgrxSignalForm', () => {
    const actual = generate('testFormName', 'value');
    expect(actual).toEqual({
      testFormName: {
        id: 'testFormName',
        isDirty: false,
        isDisabled: false,
        hasErrors: false,
        value: 'value'
      }
    });
  });

  test('generate should convert objects to NgrxSignalForm', () => {
    const actual = generate('testFormName', { a: 'value' });
    expect(actual).toEqual({
      'testFormName.a': {
        id: 'testFormName.a',
        isDirty: false,
        isDisabled: false,
        hasErrors: false,
        value: 'value'
      }
    });
  });

  test('generate should convert arrays to NgrxSignalForm', () => {
    const actual = generate('testFormName', [ 'value' ]);
    expect(actual).toEqual({
      'testFormName.0': {
        id: 'testFormName.0',
        isDirty: false,
        isDisabled: false,
        hasErrors: false,
        value: 'value'
      }
    });
  });
});
