import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { GlobalDialogComponent } from '../../shared/global-dialog/global-dialog.component';
import { UserProfile } from '../../store/user-profile';
let errors = require('../message.json')

@Component({
  selector: 'my-nekwork-status',
  templateUrl: './my-nekwork-status.component.html',
  styleUrls: ['./my-nekwork-status.component.css'],
})
export class MyNekworkStatusComponent implements OnInit {
  @Input() removeById: string;
  @Input() elementStatus: string;
  @Output() selectedId: EventEmitter<string> = new EventEmitter<string>();
  @Output() isRerender: EventEmitter<boolean> = new EventEmitter<boolean>();
  confirm: boolean;
  isConnected: boolean;

  constructor(private dialog: MatDialog, private userProfile: UserProfile) {
  }

  ngOnInit() {
    if (this.elementStatus == 'connected') {
      this.isConnected = true
    }
    else {
      this.isConnected = false;
    }
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      heading: 'Disconnecting Account..?',
      description: errors.errors.disconnectNetworkPopup,
      actionButtonText: 'Disconnect'
    };
    const dialogRef = this.dialog.open(GlobalDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.isConnected = false;
        this.selectedId.emit(this.removeById);
      } else {
        this.isRerender.emit(true);
      }
    });
  }

}
