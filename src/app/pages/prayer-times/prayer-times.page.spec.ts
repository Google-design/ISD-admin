import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrayerTimesPage } from './prayer-times.page';

describe('PrayerTimesPage', () => {
  let component: PrayerTimesPage;
  let fixture: ComponentFixture<PrayerTimesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PrayerTimesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
