import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedinConnectorComponent } from './linkedin-connector.component';

describe('LinkedinConnectorComponent', () => {
  let component: LinkedinConnectorComponent;
  let fixture: ComponentFixture<LinkedinConnectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkedinConnectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedinConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
