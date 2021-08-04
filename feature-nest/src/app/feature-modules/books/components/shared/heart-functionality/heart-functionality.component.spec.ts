import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeartFunctionalityComponent } from './heart-functionality.component';

describe('HeartFunctionalityComponent', () => {
  let component: HeartFunctionalityComponent;
  let fixture: ComponentFixture<HeartFunctionalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeartFunctionalityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeartFunctionalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
