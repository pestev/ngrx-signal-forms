import { ValidatorConfig, ValidatorFn } from '../types/ngrx-signal-form-validation.types';
import { normalizeValidators }          from './ngrx-signal-form-validation.utils';

const emptyValidator: ValidatorFn = () => ({});

describe('normalizeValidators', () => {

  it('should normalize validator for empty value', () => {
    const formName = 'testForm';
    const validatorsConfig = undefined;
    const normalized = normalizeValidators(formName, validatorsConfig);

    expect(normalized).toEqual({});
  });

  it('should normalize validator for primitive value', () => {
    const formName = 'testForm';
    const validatorsConfig: ValidatorConfig<string> = emptyValidator;
    const normalized = normalizeValidators<string>(formName, validatorsConfig);

    expect(normalized).toEqual({
      [formName]: emptyValidator
    });
  });

  it('should normalize validator for array value', () => {
    const formName = 'testForm';
    const validatorsConfig: ValidatorConfig<string[]> = emptyValidator;
    const normalized = normalizeValidators<string[]>(formName, validatorsConfig);

    expect(normalized).toEqual({
      [formName]: emptyValidator
    });
  });

  it('should normalize validator for object value', () => {
    const formName = 'testForm';
    const validatorsConfig: ValidatorConfig<{ testProp: string }> = { testProp: emptyValidator };
    const normalized = normalizeValidators<{ testProp: string }>(formName, validatorsConfig);

    expect(normalized).toEqual({
      [`${ formName }.testProp`]: emptyValidator
    });
  });

  it('should normalize validator for complex value', () => {
    const formName = 'testForm';
    const validatorsConfig: ValidatorConfig<{
      testProp: string,
      testPropWithNested: {
        nestedTestProp: string
      },
      testPropSimpleArray: string[],
      testPropObjectArray: {
        arrayNestedProp: string
      }[]
    }> = {
      testProp: emptyValidator,
      testPropWithNested: {
        nestedTestProp: emptyValidator
      },
      testPropSimpleArray: emptyValidator,
      testPropObjectArray: {
        arrayNestedProp: emptyValidator
      }
    };
    const normalized = normalizeValidators<{ testProp: string }>(formName, validatorsConfig);

    expect(normalized).toEqual({
      [`${ formName }.testProp`]: emptyValidator,
      [`${ formName }.testPropWithNested.nestedTestProp`]: emptyValidator,
      [`${ formName }.testPropSimpleArray`]: emptyValidator,
      [`${ formName }.testPropObjectArray.arrayNestedProp`]: emptyValidator
    });
  });

});
