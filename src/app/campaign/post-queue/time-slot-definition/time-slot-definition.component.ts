import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UUID } from 'angular2-uuid';
// import { CustomMessage } from '../../shared/models/custom-message';
import { CustomMessage } from './../../shared/models/custom-message';
import { setHours } from 'date-fns';

@Component({
  selector: 'time-slot-definition',
  templateUrl: './time-slot-definition.component.html',
  styleUrls: ['./time-slot-definition.component.css']
})
export class TimeSlotDefinitionComponent implements OnInit {
  invalidEndTime: boolean = false;
  startTime: Date = new Date();
  endTime: Date = new Date();
  maximumEndTime: Date = new Date();
  customMessage: CustomMessage = new CustomMessage();
  timeIntervals: Array<number> = [15, 30, 45, 60];
  selectedInterval: number = 15;
  onAddSlot = new EventEmitter();
  showLoader: boolean = false;

  constructor(public dialogRef: MatDialogRef<TimeSlotDefinitionComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit() {
    this.endTime.setMinutes(this.startTime.getMinutes() + 15);
    this.maximumEndTime.setHours(23, 59);
  }

  changeEndTime() {
    this.endTime = new Date(this.startTime);
    this.endTime.setMinutes(this.startTime.getMinutes() + this.selectedInterval);
    this.maximumEndTime.setHours(23, 59);
  }

  addTimeSlot() {
    if (this.startTime >= this.endTime) {
      this.customMessage.status = "error";
      this.customMessage.message = "End time should be greater than start";
      setTimeout(() => {
        this.customMessage.status = "";
        this.customMessage.message = "";
      }, 2000);
    }
    else {
      let newId = UUID.UUID();
      let newTime = {
        id: newId,
        startTime: this.startTime,
        endTime: this.endTime
      }
      this.onAddSlot.emit(newTime);
    }
  }

  addInterval() {
    this.endTime = new Date(this.startTime);
    this.endTime.setMinutes(this.startTime.getMinutes() + this.selectedInterval);
    this.maximumEndTime.setHours(23, 59);
  }


  closeDialog() {
    this.dialogRef.close();
  }

}
