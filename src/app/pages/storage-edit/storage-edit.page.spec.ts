import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StorageEditPage } from './storage-edit.page';

describe('StorageEditPage', () => {
  let component: StorageEditPage;
  let fixture: ComponentFixture<StorageEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
