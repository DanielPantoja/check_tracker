import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllChecksComponent } from './all-checks.component';

describe('AllChecksComponent', () => {
  let component: AllChecksComponent;
  let fixture: ComponentFixture<AllChecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllChecksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
