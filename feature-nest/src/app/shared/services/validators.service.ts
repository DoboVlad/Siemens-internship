import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';

import 'firebase/database';
import { LoadingService } from 'src/app/core/services/utility/loading-spinner/loading.service';


@Injectable({
  providedIn: 'root',
})
export class ValidatorsService {
  constructor(
    private afAuth: AngularFireAuth,
    private loadingService: LoadingService
  ) {}

  NumberValidator(control: FormControl): { [key: string]: boolean } | null {
    const value = control.value;

    if (!/[0-9]+/.test(value)) return { hasNotNumber: true };
    return null;
  }

  CapitalCaseValidator(
    control: FormControl
  ): { [key: string]: boolean } | null {
    const value = control.value;
    if (!/[A-Z]+/.test(value)) return { hasNotUpperCase: true };
    return null;
  }

  SmallLetterValdiator(
    control: FormControl
  ): { [key: string]: boolean } | null {
    const value = control.value;
    if (!/[a-z]+/.test(value)) return { hasNotLowerCase: true };
    return null;
  }

  SpecialCharacterValidator(
    control: FormControl
  ): { [key: string]: boolean } | null {
    const value = control.value;
    if (!/[$&+,:;=?@#|'<>.^*()%!-]+/.test(value))
      return { hasNotSpecialCharacter: true };
    return null;
  }

  passwordConfirm(form: AbstractControl): { [key: string]: boolean } | null {
    if (form.get('password')?.value !== form.get('confirmPassword')?.value) {
      return { isNotMatching: true };
    }
    return null;
  }

  CheckedValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    if (!control.get('confirmTermsAndService')?.valid)
      return { isNotChecked: true };
    return null;
  }

  emailValidator(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Promise<{ [key: string]: boolean } | null> => {
      this.loadingService.show();
      return this.searchEmail(control.value).then((res) => {
        this.loadingService.hide();
        return res.length > 0 ? { emailExist: true } : null;
      });
    };
  }

  searchEmail(email: string): Promise<any> {
    return this.afAuth.fetchSignInMethodsForEmail(email);
  }
}
