import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignFeedbackComponent } from './campaign-feedback.component';

describe('CampaignFeedbackComponent', () => {
  let component: CampaignFeedbackComponent;
  let fixture: ComponentFixture<CampaignFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
