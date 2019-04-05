import { Component, OnInit ,Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { CampaignService } from './../shared/service/campaign.service';
@Component({
  selector: 'campaign-comments-invitation-container',
  templateUrl: './campaign-comments-invitation-container.component.html',
  styleUrls: ['./campaign-comments-invitation-container.component.css']
})
export class CampaignCommentsInvitationContainerComponent implements OnInit {
  isValid:boolean;
  constructor( public dialogRef: MatDialogRef<CampaignCommentsInvitationContainerComponent>,
    @Inject(MAT_DIALOG_DATA) public data,public campaignService:CampaignService) { }

  ngOnInit() {
    this.isValid = false;
  }
  closePopup = ($event) =>{
    this.dialogRef.close();
  }
  sendInvitation = ($event) =>{
    if($event.email){
      this.isValid = true;
      $event["inviteType"] = "comment";
      this.dialogRef.close($event);
    }

  }
}
