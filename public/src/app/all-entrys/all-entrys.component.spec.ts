import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEntrysComponent } from './all-entrys.component';

describe('AllEntrysComponent', () => {
  let component: AllEntrysComponent;
  let fixture: ComponentFixture<AllEntrysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllEntrysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllEntrysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
