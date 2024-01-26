import { creator } from '../../utils/ngrx-signal-form-create.utils';

export function resetFormUpdater<TFormName extends string, TFormValue>(
  formName: TFormName,
  formValue: TFormValue
) {

  return { formState: creator(formName, formValue) };
}
