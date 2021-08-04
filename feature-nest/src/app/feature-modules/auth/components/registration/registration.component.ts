import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { regex } from 'src/app/constants/regex';
import { ValidatorsService } from 'src/app/shared/services/validators.service';
import { RegisterDataModel } from '../../model/register-model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/core/services/utility/loading-spinner/loading.service';
import { BookLoadingService } from 'src/app/core/services/utility/loading-spinner/book-loading.service';
import { ToastsServiceService } from 'src/app/shared/services/toasts.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],

  // providers: [AngularFireAuth],
})
export class RegistrationComponent implements OnInit {
  isLoading = false;
  registerForm = new FormGroup(
    {
      firstName: new FormControl('', {
        validators: [Validators.required, Validators.pattern(regex.firstName)],
      }),
      lastName: new FormControl('', {
        validators: [Validators.required, Validators.pattern(regex.lastName)],
      }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.pattern(regex.email)],
        asyncValidators: [this.validatorsService.emailValidator()],
        updateOn: 'blur',
      }),
      password: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(7),
          this.validatorsService.NumberValidator.bind(this),
          this.validatorsService.CapitalCaseValidator.bind(this),
          this.validatorsService.SmallLetterValdiator.bind(this),
          this.validatorsService.SpecialCharacterValidator.bind(this),
        ],
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required],
      }),
    },
    {
      validators: [this.validatorsService.passwordConfirm.bind(this)],
      updateOn: 'change',
    }
  );
  disable = false;
  modalRef!: BsModalRef;
  items!: string[];
  userData!: RegisterDataModel;
  isAccepted = false;
  isDisabled = true;
  isLoadingEmail$!: Observable<boolean>;
  isLoadingData$!: Observable<boolean>;
  constructor(
    private modalService: BsModalService,
    private validatorsService: ValidatorsService,
    private authService: AuthService,
    private router: Router,
    private loadingSpinner: LoadingService,
    private bookLoadingService: BookLoadingService,
    private toastsService: ToastsServiceService
  ) {
    this.items = Array(15).fill(0);
    this.isLoadingEmail$ = this.loadingSpinner.loading$;
    this.isLoadingData$ = this.bookLoadingService.loading$;
  }

  ngOnInit(): void {}

  submit() {
    this.bookLoadingService.show();

    this.authService
      .createUser(
        this.registerForm.value.email,
        this.registerForm.value.password,
        {
          ...this.userData,
          firstName: this.registerForm.value.firstName,
          lastName: this.registerForm.value.lastName,
          email: this.registerForm.value.email,
        }
      )
      .subscribe(() => {
        this.toastsService.showInfoToast(
          'Your account has been created successfully!'
        );
        this.registerForm.reset();
        this.isAccepted = !this.isAccepted;
        this.isDisabled = true;
        this.bookLoadingService.hide();
        this.router.navigate(['/books']);
      });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
    this.isDisabled = false;
  }

  isValid() {
    if (this.registerForm.valid && this.isAccepted) {
      return true;
    }
    return false;
  }
  da() {
    this.disable = true;
  }
}
