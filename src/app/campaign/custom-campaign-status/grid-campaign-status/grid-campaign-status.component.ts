import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { GlobalDialogComponent } from '../../../shared/global-dialog/global-dialog.component';
import { CampaignStatus } from 'src/app/shared/sdk';

@Component({
  selector: 'grid-campaign-status',
  templateUrl: './grid-campaign-status.component.html',
  styleUrls: ['./grid-campaign-status.component.css']
})

export class GridCampaignStatusComponent {
  @Input() campaignStatus: Observable<CampaignStatus>;
  @Input() loaderStatus$:Observable<any>;
  @Output() onDeleteStatus: EventEmitter<CampaignStatus> = new EventEmitter<CampaignStatus>();
  @Output() onEditStatus: EventEmitter<CampaignStatus> = new EventEmitter<CampaignStatus>();

  displayedColumns: string[];
  showLoader:boolean=false;

  constructor(public dialog: MatDialog) {
    this.displayedColumns = ['Label', 'Color', 'isPublish', 'edit', 'remove'];
  }

  editCampaignStatus(element) {
    this.onEditStatus.emit(element);
  }

  deleteCampaignStatus(id) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose=true;
    dialogConfig.data = {
      heading: 'Deleting Account..?',
      description: 'Are you want to delete the Status Camapaign?',
      actionButtonText: 'Delete'
    };

    const dialogRef = this.dialog.open(GlobalDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.onDeleteStatus.emit(id);
        this.loaderStatus$.subscribe(res => {
          if (res.type == 'delete') {
            this.showLoader = res.status;
          }
        })
      }
    });
  }
}
