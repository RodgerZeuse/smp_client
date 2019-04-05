import { Component,ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CampaignsStore } from '../../../store/campaigns-store';
import { Router } from '@angular/router';
import { SearchCriteria } from "../model/search-criteria";
import { UserProfile } from '../../../store/user-profile';
import { SwitchViewsModel } from './switch-views-model';
import { SearchCampaign } from '../search-campaign/search-campaign-model';
import { CampaignService } from './../../shared/service/campaign.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'campaign-list-container',
  templateUrl: './campaign-list-container.component.html',
  styleUrls: ['./campaign-list-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CampainListContainerComponent implements OnInit {
  groupRights = require("../../../shared/config/group-rights.json").groupRights;

  scheduledAt: Date = null;
  swithViews: SwitchViewsModel = new SwitchViewsModel();
  searchCampaign: SearchCampaign;
  criteriaIsHidden: boolean;
  isArchiveOn: boolean;
  constructor(
    public router: Router,
    private campaignService: CampaignService,
    private campaignStore: CampaignsStore,
    private profileStore: UserProfile,
    public snackBar: MatSnackBar) {
    this.isArchiveOn = false;
  }

  ngOnInit() {
    this.criteriaIsHidden = false;
    // if (this.campaignStore.campaignsListFromStore.length == 0) {
    // this.campaignService.getCamapign().subscribe();  
    // }
  }

  removeCampaign(campaign) {
    this.campaignService.removeCampaign(campaign).subscribe(res => {
      // this.campaignService.getCamapign().subscribe(res => {
      // });
    }, err => {
      this.openSnackBar(err.message, 'close');
    });
  }

  toogleArchive(isArchiveOn) {
    this.isArchiveOn = isArchiveOn;
    if (isArchiveOn) {
      this.campaignService.getArchive().subscribe();
    } else {
      this.campaignService.getCamapign().subscribe();
    }
  }

  onConfirmArchiveSelection(campaignCollectionForArchive: Array<string>) {
    if (campaignCollectionForArchive.length > 0) {
      this.campaignService.moveToArchive(campaignCollectionForArchive).subscribe(res => {
        this.openSnackBar('campaigns moved into archive', 'close');
        this.campaignService.getCamapign().subscribe();
      })
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }

  updateSelectedDate(scheduleAt: Date) {
    this.scheduledAt = scheduleAt;
  }

  gotoCreateCampaign() {
    if (this.scheduledAt) {
      this.router.navigate(['campaign'], { queryParams: { scheduledAt: this.scheduledAt } });
    }
    else {
      this.router.navigateByUrl("campaign");
    }
  }

  rescheduleCampaign(event: any) {
    this.campaignService.rescheduleCampaign(event.id, event.newDate).subscribe(res => { });
  }

  searchCampaigns(criteria: SearchCriteria) {
    if (this.isArchiveOn) {
      this.campaignService.searchArchiveCampaigns(criteria).subscribe(res => {
      });
    } else {
      this.campaignService.searchCampains(criteria).subscribe(res => {
      });
    }
  }

  searchForCampaign(campaign: SearchCampaign) {
    this.searchCampaign = campaign;
  }

  openCalendarView() {
    this.swithViews.isCalendarOpen = true;
    this.swithViews.isListOpen = false;
    this.swithViews.isTimelineOpen = false;
  }

  openListView() {
    this.swithViews.isCalendarOpen = false;
    this.swithViews.isListOpen = true;
    this.swithViews.isTimelineOpen = false;
  }

  openTimelineView() {
    this.swithViews.isCalendarOpen = false;
    this.swithViews.isListOpen = false;
    this.swithViews.isTimelineOpen = true;
  }
}