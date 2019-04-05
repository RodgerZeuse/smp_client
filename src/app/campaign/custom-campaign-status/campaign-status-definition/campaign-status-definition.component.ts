import { Component, OnInit, EventEmitter, Inject, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CustomMessage } from "../../shared/models/custom-message";
import { CampaignStatus } from 'src/app/shared/sdk';

@Component({
  selector: 'campaign-status-definition',
  templateUrl: './campaign-status-definition.component.html',
  styleUrls: ['./campaign-status-definition.component.css']
})
export class CampaignStatusDefinitionComponent implements OnInit {
  customStatusForm: FormGroup;
  customStatus: any = new CampaignStatus();
  statusMessage: CustomMessage = new CustomMessage();
  updateCustomStatus = new EventEmitter();
  disableSubmit: boolean = false;
  dialogBoxType: string = '';
  showLoader:boolean=false;

  constructor(public dialogRef: MatDialogRef<CampaignStatusDefinitionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  updateStatus() {
    this.customStatus.statusName = this.customStatusForm.controls.statusName.value;
    this.customStatus.statusColor = this.customStatusForm.controls.statusColor.value;
    this.customStatus.isPublishable = this.customStatusForm.controls.isPublishable.value;
    this.disableSubmit = true;
    this.updateCustomStatus.emit(this.customStatus);
  }

  onClose() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.dialogBoxType = "Add new";
    this.disableSubmit = false;
    this.customStatusForm = new FormGroup({
      statusName: new FormControl('', Validators.required),
      statusColor: new FormControl('', Validators.required),
      isPublishable: new FormControl('')
    })

    if (this.data != null && this.data.data) {
      this.dialogBoxType = "Edit";
      this.customStatus.statusName = this.data.data.status.statusName,
        this.customStatus.statusColor = this.data.data.status.statusColor,
        this.customStatus.isPublishable = this.data.data.status.isPublishable
    }
  }
}
