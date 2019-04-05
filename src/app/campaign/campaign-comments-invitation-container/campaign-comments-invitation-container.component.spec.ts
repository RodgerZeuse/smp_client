import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignCommentsInvitationContainerComponent } from './campaign-comments-invitation-container.component';

describe('CampaignCommentsInvitationContainerComponent', () => {
  let component: CampaignCommentsInvitationContainerComponent;
  let fixture: ComponentFixture<CampaignCommentsInvitationContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignCommentsInvitationContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignCommentsInvitationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
