import { TestBed } from '@angular/core/testing';

import { RecommendedBooksService } from './recommended-books.service';

describe('RecommendedBooksService', () => {
  let service: RecommendedBooksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecommendedBooksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
