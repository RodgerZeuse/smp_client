import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetpasswordContainerComponent } from './forgetpassword-container.component';

describe('ForgetpasswordContainerComponent', () => {
  let component: ForgetpasswordContainerComponent;
  let fixture: ComponentFixture<ForgetpasswordContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgetpasswordContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgetpasswordContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
