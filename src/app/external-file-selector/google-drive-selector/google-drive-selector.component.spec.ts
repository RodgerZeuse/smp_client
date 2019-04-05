import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleDriveSelectorComponent } from './google-drive-selector.component';

describe('GoogleDriveSelectorComponent', () => {
  let component: GoogleDriveSelectorComponent;
  let fixture: ComponentFixture<GoogleDriveSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleDriveSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleDriveSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
