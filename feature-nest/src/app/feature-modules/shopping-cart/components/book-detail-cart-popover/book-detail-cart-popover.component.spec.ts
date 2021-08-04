import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDetailCartPopoverComponent } from './book-detail-cart-popover.component';

describe('BookDetailCartPopoverComponent', () => {
  let component: BookDetailCartPopoverComponent;
  let fixture: ComponentFixture<BookDetailCartPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookDetailCartPopoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDetailCartPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
