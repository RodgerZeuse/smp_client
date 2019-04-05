import { Component,ChangeDetectionStrategy, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Campaign, Post } from '../../../shared/sdk';
import * as moment from "moment";
import * as _ from "lodash"
import { CampaignsStore } from 'src/app/store/campaigns-store';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { GlobalDialogComponent } from 'src/app/shared/global-dialog/global-dialog.component';
import { Router } from '@angular/router';
import { UserProfile } from 'src/app/store/user-profile';
let errors  = require("../../../shared/config/specificError.json").specificError;

@Component({
  selector: 'campaign-timeline',
  templateUrl: './campaign-timeline.component.html',
  styleUrls: ['./campaign-timeline.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampaignTimelineComponent implements OnInit {
  @Input() campaigns: Array<Campaign>;
  @Output() remove: EventEmitter<Campaign> = new EventEmitter<Campaign>();

  icons: any;
  campaign: Campaign = new Campaign();
  campaignForDetails: Campaign;
  openCard: number = -1;
  shownDates: Array<string> = new Array<string>();
  networkType: string;
  groupRights = require("../../../shared/config/group-rights.json").groupRights;


  constructor(public router: Router, public dialog: MatDialog, private campaignStore: CampaignsStore, private profileStore: UserProfile) {
    this.icons = require('./../../../shared/config/icons.json').icons;
  }

  ngOnInit() {
    let dateToCampare: string;
    let uniqueDates: Array<string> = new Array<string>()
    this.campaigns.map(campaign => {
      this.campaign = campaign;
      dateToCampare = moment(campaign.scheduledAt).format("MM/DD/YYYY");
      uniqueDates.push(dateToCampare);
    });
    this.shownDates = _.reverse(_.sortedUniq(_.uniq(uniqueDates)));
  }

  getCampaignsOfDate(dt): Campaign[] {
    let chooseCampaigns = this.campaigns.filter(x => moment(x.scheduledAt).format("MM/DD/YYYY") === dt)
    return chooseCampaigns;
  }

  networkCount(posts: Array<Post>, type: string) {
    this.campaignStore.setNetwork(posts, type);
    return this.campaignStore.networkCount;
  }

  showDetailMessageBox(campaign: Campaign, index: number) {
    this.campaignForDetails = campaign;
    this.openCard = index;
  }

  editCampaign(campaign: Campaign) {
    this.campaign = campaign;
      if (this.campaign.state == 'Canceled' || this.campaign.state == 'Posted') {
        localStorage.setItem("route", "Reschedule Campaign");
      } else {
        localStorage.removeItem('route');
      }
      this.router.navigate(['/campaign/edit-campaign'], { queryParams: { id: campaign.id } })
    
  }


  removeCampaign(campaign: Campaign) {
      this.showDeleteDialog(campaign);
  }


  showDeleteDialog(campaign:Campaign) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      heading: 'Delate Campaign..',
      description: errors.campaignDeleteDialog,
      actionButtonText: 'Yes'
    }
    const dialogRef = this.dialog.open(GlobalDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if (data == true) {
          this.remove.emit(campaign);
        }
      }
    );
  }
}
