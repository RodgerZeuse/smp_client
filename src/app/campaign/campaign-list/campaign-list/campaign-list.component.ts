import { ViewEncapsulation, Component,ChangeDetectorRef, Input, ChangeDetectionStrategy, Output, EventEmitter, ViewChild, OnChanges, HostListener, OnInit } from '@angular/core';
import { Campaign, Post } from "../../../shared/sdk/models";
import { GlobalDialogComponent } from "../../../shared/global-dialog/global-dialog.component";
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource, MatPaginator, MatSnackBar, MAT_CHECKBOX_CLICK_ACTION } from '@angular/material';
import { Router } from '@angular/router';
import { CampaignsStore } from '../../../store/campaigns-store';
import { UserProfile } from '../../../store/user-profile';
import { CampaignService } from './../../shared/service/campaign.service';
import { find } from 'rxjs/operators';
import { CampaignListViewModel } from '../../shared/models/campaignListViewModel';
import { Observable } from 'rxjs';
let errors = require('../../../shared/config/specificError.json').specificError;
// import { post } from 'selenium-webdriver/http';
import { CampaignStatusEnum } from '../../shared/components/campaign-definition/model/status.model';
// let errors = require('../message.json')

@Component({
  selector: 'campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,

})

export class CampaignListComponent implements OnInit,  OnChanges {
  icons: Array<any> = [];
  @ViewChild(MatSort) sort: MatSort;
  @Input() campaigns: Array<CampaignListViewModel>;
  @Output() remove: EventEmitter<string | number> = new EventEmitter<string | number>();
  @Output() getMoreCampaigns: EventEmitter<number> = new EventEmitter<number>();
  @Output() onConfirmArchiveSelection: EventEmitter<Array<string>> = new EventEmitter<Array<string>>();
  @Input() showSelectionOnCampaign: boolean;
  // @Output() onSingleSelectUnselect: EventEmitter<string> = new EventEmitter<string>();
  // @Output() onCancelSelection: EventEmitter<boolean> = new EventEmitter<boolean>()
  isAllowSelection: boolean = false;
  campaignsToArchive: Array<string> = [];
  displayedColumns: string[];
  openCard: number = -1;
  campaign: Campaign;
  dataSource: any;
  interminate: boolean = false;
  checked: boolean = false
  groupRights = require("../../../shared/config/group-rights.json").groupRights;

  constructor(public router: Router,
    private changeDetectorRefs: ChangeDetectorRef,
    private campaignStore: CampaignsStore,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private profileStore: UserProfile) {
    this.campaign = new Campaign();
  }

ngOnChanges(){
  setTimeout(() => {

    this.dataSource = new MatTableDataSource(this.campaigns);
    this.changeDetectorRefs.markForCheck();
    // this.changeDetectorRefs.detectChanges();
  }, 200);
    
}
  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.campaigns);
    this.dataSource.sort = this.sort;
    this.icons = require('./../../../shared/config/icons.json').icons;
      this.displayedColumns = ['type', 'title', 'description', 'campaignStatus', 'mediaFiles', 'createdAt', 'state', 'scheduledAt', 'remove', 'edit'];
  }

  onSelectAll(selectAll: boolean) {
    this.campaigns.forEach(campaign => {
      if (!campaign.isSelected && campaign.state==CampaignStatusEnum.posted) {
        campaign.isSelected = true;
        this.campaignsToArchive.push(campaign.id);
      }
    })
    if(this.campaignsToArchive.length==0){
      this.openSnackBar('there is not any posted campaign for selection','close')
    }
  }
  showWrongSelectionError(){
    this.openSnackBar('you cannot move campaigns into archive except posted', 'close');
  }
  onConfirmArchive(confirmSelection: boolean) {
    if (this.campaignsToArchive.length > 0) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        heading: 'Confirm Action',
        description: 'Do you really want to move selected campaigns into archive',
        // inputHeading: 'Feed back ',
        actionButtonText: 'Move To Archive'
      };

      const dialogRef = this.dialog.open(GlobalDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.onConfirmArchiveSelection.emit(this.campaignsToArchive);
          this.isAllowSelection = false;
          this.campaignsToArchive = [];
          this.ngOnInit();
        }

      });
    } else {
      this.openSnackBar("Please select at least one campaign", 'close');
    }
  }

  onSelectionSingleCampaignForArchive(campaignId: string) {
    let foundCampaign = this.campaigns.find(x => x.id == campaignId);
    if (foundCampaign) {
      if (foundCampaign.isSelected) {
        foundCampaign.isSelected = false
        let toRemoveCampaign = this.campaignsToArchive.findIndex(x => x == campaignId);
        if (toRemoveCampaign > -1) {
          this.campaignsToArchive.splice(toRemoveCampaign, 1)
          console.log("archive collection", this.campaignsToArchive);

        }
      } else {
        foundCampaign.isSelected = true;
        this.campaignsToArchive.push(campaignId);
        console.log("archive collection", this.campaignsToArchive);
      }

    }
  }

  onAllowOrCancelSelection(allowSelection: boolean) {
    this.isAllowSelection = allowSelection;
    if (this.isAllowSelection) {
      this.displayedColumns = ['checkboxSelection', 'type', 'title', 'description', 'campaignStatus', 'mediaFiles', 'createdAt', 'state', 'scheduledAt'];
    }
    else {
      this.ngOnInit();
      let foundCampaign = this.campaigns.filter(x => x.isSelected == true);
      // this.displayedColumns = ['type', 'title', 'description', 'campaignStatus', 'mediaFiles', 'createdAt', 'state', 'scheduledAt', 'remove', 'edit'];
      this.campaignsToArchive = [];
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }

  // openConfirmationDialog() {

  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.data = {
  //     heading: 'Confirm Action',
  //     description: 'Do you really want to move selected campaigns into archive',
  //     // inputHeading: 'Feed back ',
  //     actionButtonText: 'Delete'
  //   };

  //   const dialogRef = this.dialog.open(GlobalDialogComponent, dialogConfig);
  //   dialogRef.afterClosed().subscribe(result => {
  //     if(result==true){
  //       this.onConfirmArchiveSelection.emit(this.campaignsToArchive);
  //       this.isAllowSelection = false;
  //       this.ngOnInit();
  //     }else{
  //       alert('failed')
  //     }
  //   });
  // }

  rescheduleCampaign(campaign: Campaign) {
      if (campaign.state == 'Canceled' || campaign.state == 'Posted') {
        localStorage.setItem("route", "Reschedule Campaign");
      } else {
        localStorage.removeItem('route');
      }
      this.router.navigate(['/campaign'], { queryParams: { id: campaign.id } })
  }

  editCampaign(campaign: Campaign) {
    // this.campaign = campaign;
     // if (this.campaign.state == 'Canceled' || this.campaign.state == 'Posted') {
      //   localStorage.setItem("route", "Reschedule Campaign");
      // } else {
      localStorage.removeItem('route');
      // }
      this.router.navigate(['/campaign/edit-campaign'], { queryParams: { id: campaign.id } })
    
  }

  showDetailMessageBox(campaign: Campaign, index: number) {
    this.campaign = campaign;
    this.openCard = index;
  }

  removeCampaign(campaign: Campaign) {
         this.showDeleteDialog(campaign);
  }

  networkCount(posts: Array<Post>, type: string) {
    this.campaignStore.setNetwork(posts, type);
    return this.campaignStore.networkCount;
  }

  showDeleteDialog(campaign) {
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

  openDialog(posts) {
    let errorsArray = [];
    posts.forEach(post => {
      if (post.error) {
        let errorObj = JSON.parse(post.error);
        if (errorObj) {
          if (errorObj.error.code == 190) {
            errorsArray.push(errors.openDialogMessage);
          } else if (errorObj.error.code == 506) {
            errorsArray.push(errorObj.error.error_user_msg)
          } else if (errorObj.error) {
            errorsArray.push(errorObj.error.message);
          }
        } else {
          errorsArray.push(errorObj);
        }
      }
    });
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 2,
      heading: 'Canceled',
      detailsArray: errorsArray
    };
    const dialogRef = this.dialog.open(GlobalDialogComponent, dialogConfig);
  }
}

