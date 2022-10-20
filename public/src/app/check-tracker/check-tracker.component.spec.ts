import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckTrackerComponent } from './check-tracker.component';

describe('CheckTrackerComponent', () => {
  let component: CheckTrackerComponent;
  let fixture: ComponentFixture<CheckTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckTrackerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
