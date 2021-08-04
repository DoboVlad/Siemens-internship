import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, map, mapTo, startWith, throttleTime } from 'rxjs/operators';
import { PHONE_SIZE } from 'src/app/constants/phone_size';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {

  isMobile$: Observable<any>;

  constructor() {
    this.isMobile$ = fromEvent(window, 'resize').pipe(
      throttleTime(500),
      debounceTime(500),
      startWith(window),
      mapTo(window),
      map((window: Window) => {
        if (window.innerWidth < PHONE_SIZE.width && window.innerHeight < PHONE_SIZE.height) {
          return true;
        }
        return false;
      })
    );
  }
}
