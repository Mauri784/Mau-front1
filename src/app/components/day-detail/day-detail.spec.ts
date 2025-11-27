import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayDetail } from './day-detail';

describe('DayDetail', () => {
  let component: DayDetail;
  let fixture: ComponentFixture<DayDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
