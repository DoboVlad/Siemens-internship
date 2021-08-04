import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistPopoverComponent } from './wishlist-popover.component';

describe('WishlistPopoverComponent', () => {
  let component: WishlistPopoverComponent;
  let fixture: ComponentFixture<WishlistPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WishlistPopoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
