import { TestBed } from '@angular/core/testing';

import { BookLoadingService } from './book-loading.service';

describe('BookLoadingService', () => {
  let service: BookLoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookLoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
