import { Component, OnInit } from '@angular/core';
import { CamapignStatusService } from '../service/camapign-status.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CampaignStatusDefinitionComponent } from "../campaign-status-definition/campaign-status-definition.component";
import { CampaignStatusStore } from "../../../store/campaign-status-store";
import { CampaignStatus } from 'src/app/shared/sdk';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'custom-campaign-status-container',
  templateUrl: './campaign-status-container.component.html',
  styleUrls: ['./campaign-status-container.component.css'],
})

export class CampaignStatusContainerComponent implements OnInit {
  customStatus: Array<CampaignStatus> = new Array<CampaignStatus>();
  customStatus$ = new BehaviorSubject(this.customStatus)
  loaderStatus = { type: '', status: false };
  loaderStatus$ = new BehaviorSubject(this.loaderStatus);

  constructor(private customStatusService: CamapignStatusService, public dialog: MatDialog, private campaignStatusStore: CampaignStatusStore) { }

  ngOnInit() {
    if (this.campaignStatusStore.customStatuses.length > 0) {
      this.customStatus$.next(this.campaignStatusStore.customStatuses);
    } else {
      this.getCustomStatus();
    }
  }

  deleteCamapignStatus(statusId) {
    this.loaderStatus.type = "delete";
    this.loaderStatus.status = true;
    this.loaderStatus$.next(this.loaderStatus);
    this.customStatusService.deleteCamapaignStatus(statusId).subscribe(res => {
      this.loaderStatus.type = "delete";
      this.loaderStatus.status = false;
      this.loaderStatus$.next(this.loaderStatus);
      this.customStatus$.next(this.campaignStatusStore.customStatuses);
    })
  }

  addNewStatus() {
    const dialogBoxReferance = this.dialog.open(CampaignStatusDefinitionComponent, {
      width: '350px',
      height: 'auto',
      disableClose: true,
      panelClass: 'myclass'
    });

    dialogBoxReferance.componentInstance.updateCustomStatus.subscribe(res => {
      let statusDialog = dialogBoxReferance.componentInstance;
      let indexOfduplicate = -1;

      if (this.campaignStatusStore.customStatuses.length > 0) {
        indexOfduplicate = this.campaignStatusStore.customStatuses.findIndex(x => x.status.statusName.toLowerCase().replace(/ {1,}/g," ").trim() == statusDialog.customStatusForm.controls.statusName.value.toLowerCase().replace(/ {1,}/g," ").trim());
      }
      if (this.campaignStatusStore.customStatuses.length > 0 && indexOfduplicate > -1) {
        statusDialog.statusMessage.status = "error";
        statusDialog.statusMessage.message = "Status name must be unique";
        statusDialog.disableSubmit = false;
        setTimeout(() => {
          statusDialog.statusMessage.status = "";
          statusDialog.statusMessage.message = "";
        }, 2000);
      } else {
        statusDialog.showLoader = true;

        let statusToAdd = {
          statusName: res.statusName.replace(/ {1,}/g," ").trim(),
          statusColor: res.statusColor,
          isPublishable: res.isPublishable
        }

        this.customStatusService.addCamapaignStatus(statusToAdd).subscribe((res1: any) => {
          this.customStatus$.next(this.campaignStatusStore.customStatuses);
          statusDialog.statusMessage.status = "success";
          statusDialog.statusMessage.message = "Status is created successfully";
          statusDialog.showLoader = false;
          setTimeout(() => {
            statusDialog.statusMessage.status = "";
            statusDialog.statusMessage.message = "";
          }, 2000);
        })
      }
    });
  }

  updateNewStatus(customStatus: CampaignStatus) {
    const dialogBoxConfiguration = new MatDialogConfig();
    dialogBoxConfiguration.data = customStatus;
    const dialogBoxReferance = this.dialog.open(CampaignStatusDefinitionComponent, {
      data: dialogBoxConfiguration,
      width: '350px',
      height: 'auto',
      disableClose: true,
      panelClass: 'myclass'
    });
    
    dialogBoxReferance.componentInstance.updateCustomStatus.subscribe(res => {
      let statusDialog = dialogBoxReferance.componentInstance;
      let indexOfduplicate = -1;
      statusDialog.showLoader = true;
      if (this.campaignStatusStore.customStatuses.length > 0) {
        indexOfduplicate = this.campaignStatusStore.customStatuses.findIndex(x => x.status.statusName.toLowerCase().replace(/ {1,}/g," ").trim() == res.statusName.toLowerCase().replace(/ {1,}/g," ").trim() && res.id == x.status.id);
      }

      if ((customStatus.status.statusName.toLowerCase().replace(/ {1,}/g," ").trim() == res.statusName.toLowerCase().replace(/ {1,}/g," ").trim() && indexOfduplicate > -1) || (customStatus.status.statusName.toLowerCase().replace(/ {1,}/g," ").trim() != res.statusName.toLowerCase().replace(/ {1,}/g," ").trim() && indexOfduplicate == -1)) {

        let statusToUpdate = {
          statusName: res.statusName.replace(/ {1,}/g," ").trim(),
          statusColor: res.statusColor,
          isPublishable: res.isPublishable
        }

        this.customStatusService.updateCamapaignStatus(customStatus.id, statusToUpdate).subscribe(res1 => {
          this.customStatus$.next(this.campaignStatusStore.customStatuses);
          statusDialog.statusMessage.status = "success";
          statusDialog.statusMessage.message = "Status is updated successfully.";
          statusDialog.showLoader = false;

          setTimeout(() => {
            statusDialog.statusMessage.status = "";
            statusDialog.statusMessage.message = "";
          }, 2000);
        })
      }
      else {
        statusDialog.statusMessage.status = "error";
        statusDialog.statusMessage.message = "Status name must be unique";
        statusDialog.disableSubmit = false;
        setTimeout(() => {
          statusDialog.statusMessage.status = "";
          statusDialog.statusMessage.message = "";
        }, 2000);
        statusDialog.showLoader = false;
      }
    });
  }

  getCustomStatus() {
    this.customStatusService.getCustomStatus().subscribe(res => {
      this.customStatus$.next(this.campaignStatusStore.customStatuses);
    })
  }
}
