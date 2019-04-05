import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild
} from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { Observable } from "rxjs";
import { PostQueueViewModal } from "../model/post-queue-modal";
import { TimeSlotDefinitionComponent } from "../time-slot-definition/time-slot-definition.component";
import { GlobalDialogComponent } from "src/app/shared/global-dialog/global-dialog.component";
import { CustomMessage } from "../../shared/models/custom-message";

@Component({
  selector: "post-queue",
  templateUrl: "./post-queue.component.html",
  styleUrls: ["./post-queue.component.css"]
})
export class PostQueueComponent implements OnInit {
  @Input() responseMessage$: Observable<CustomMessage>;
  @Input() loaderStatus$: Observable<any>;
  @Input() postToQueue$: Observable<PostQueueViewModal>;
  @Output() onAddTimeSlot: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDeleteSlot: EventEmitter<object> = new EventEmitter<object>();

  public startTime: Date = new Date();
  public endTime: Date = new Date();
  selectedDay: string;
  displayedColumns: string[];
  slotIsAvailable: boolean = true;
  showLoader: boolean = false;
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.displayedColumns = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    this.endTime.setMinutes(this.startTime.getMinutes() + 15);
    this.selectedDay = "Monday";
  }

  selectDayToAddSlot(day) {
    this.selectedDay = day;
  }

  addTimePopup() {
    const dialogRef = this.dialog.open(TimeSlotDefinitionComponent, {
      width: "250px",
      height: "auto",
      panelClass: "myclass",
      disableClose: true
    });
    let dialogInstance = dialogRef.componentInstance;
    dialogRef.componentInstance.onAddSlot.subscribe(res => {
      let dialogStartDateTime = res.startTime.toLocaleString();
      let dialogStartTime = dialogStartDateTime.split(",")[1];
      let dialogStartHourMinute = dialogStartTime.split(":");
      let dialogEndDateTime = res.endTime.toLocaleString();
      let dialogEndTime = dialogEndDateTime.split(",")[1];
      let dialogEndHourMinut = dialogEndTime.split(":");
      let day = this.selectedDay;
      let timeSlot = this.postToQueue$;
      let days = Object.keys(timeSlot);
      let index = days.indexOf(day);
      let temporaryTomeSlot = {
        day: this.selectedDay,
        id: res.id,
        isAvailable: false,
        from: {
          hour: dialogStartHourMinute[0],
          minute: dialogStartHourMinute[1]
        },
        to: {
          hour: dialogEndHourMinut[0],
          minute: dialogEndHourMinut[1]
        }
      };

      if (timeSlot[days[index]]) {
        this.slotIsAvailable = true;
        for (let i = 0; i < timeSlot[days[index]].length; i++) {
          let enteredStartTime =
            dialogStartHourMinute[0] + ":" + dialogStartHourMinute[1];
          let enteredEndTime =
            dialogEndHourMinut[0] + ":" + dialogEndHourMinut[1];
          let searchedStartTime =
            timeSlot[days[index]][i].from.hour +
            ":" +
            timeSlot[days[index]][i].from.minute;
          let searchedEndTime =
            timeSlot[days[index]][i].to.hour +
            ":" +
            timeSlot[days[index]][i].to.minute;
          if (
            searchedStartTime == enteredStartTime ||
            searchedStartTime == enteredEndTime ||
            searchedEndTime == enteredStartTime ||
            searchedEndTime == enteredEndTime
          ) {
            this.slotIsAvailable = false;
          } else if (
            enteredStartTime > searchedStartTime &&
            enteredStartTime < searchedEndTime
          ) {
            this.slotIsAvailable = false;
          } else if (
            enteredEndTime > searchedStartTime &&
            enteredEndTime < searchedEndTime
          ) {
            this.slotIsAvailable = false;
          } else if (
            enteredStartTime < searchedStartTime &&
            searchedEndTime < enteredEndTime
          ) {
            this.slotIsAvailable = false;
          } else if (
            enteredStartTime < searchedStartTime &&
            enteredEndTime > searchedEndTime
          ) {
            this.slotIsAvailable = false;
          }
        }
      } else {
        this.slotIsAvailable = true;
      }

      if (this.slotIsAvailable) {
        this.onAddTimeSlot.emit(temporaryTomeSlot);
        this.responseMessage$.subscribe(res => {
          dialogInstance.customMessage.status = res.status;
          dialogInstance.customMessage.message = res.message;
        });
        this.loaderStatus$.subscribe(res => {
          if (res.type == "add") {
            dialogInstance.showLoader = res.status;
          }
        });
      } else {
        dialogInstance.customMessage.status = "error";
        dialogInstance.customMessage.message = "Conflicted with slot";
        this.slotIsAvailable = true;
        setTimeout(() => {
          dialogInstance.customMessage.status = "";
          dialogInstance.customMessage.message = "";
        }, 2000);
      }
    });
  }

  deleteSlot(slotId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      heading: "Delete Time Slot",
      description: "Are you want to delete the Time Slot",
      actionButtonText: "Delete"
    };
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(GlobalDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        let temporarySlot = {
          id: slotId,
          day: this.selectedDay
        };
        this.onDeleteSlot.emit(temporarySlot);
        this.loaderStatus$.subscribe(res => {
          if (res.type == "delete") {
            this.showLoader = res.status;
          }
        });
      }
    });
  }
}
