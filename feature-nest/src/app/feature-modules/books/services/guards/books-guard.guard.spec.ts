import { TestBed } from '@angular/core/testing';

import { BooksGuardGuard } from './books-guard.guard';

describe('BooksGuardGuard', () => {
  let guard: BooksGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BooksGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
