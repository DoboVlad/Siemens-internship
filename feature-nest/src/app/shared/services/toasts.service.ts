import { Injectable } from '@angular/core';
import {
  SiNewtonToastService,
  SiToastLocation,
  SiToastTypes,
} from '@simpl/newton-ng/toast';
@Injectable({
  providedIn: 'root',
})
export class ToastsServiceService {
  constructor(private toastService: SiNewtonToastService) {}

  showSuccessToast(message: string) {
    this.toastService.showToast({
      content: message,
      type: SiToastTypes.SUCCESS,
      location: SiToastLocation.BOTTOM,
    });
  }

  showInfoToast(message: string) {
    this.toastService.showToast({
      content: message,
      type: SiToastTypes.INFO,
      timeout: 1000,
      location: SiToastLocation.BOTTOM,
    });
  }
}
