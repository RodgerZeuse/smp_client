import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { SecurityGroup } from 'src/app/shared/sdk';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { GlobalDialogComponent } from 'src/app/shared/global-dialog/global-dialog.component';
import { SecurityGroupModel } from '../security-group-model';
let errors = require('../message.json');

@Component({
  selector: 'company-groups-list',
  templateUrl: './company-groups-list.component.html',
  styleUrls: ['./company-groups-list.component.css']
})
export class CompanyGroupsListComponent {
  @Input() securityGroups$: Observable<Array<SecurityGroupModel>>;
  @Output() onUpdateSecurityGroup: EventEmitter<SecurityGroup> = new EventEmitter<SecurityGroup>();
  @Output() onDeleteSecurityGroup: EventEmitter<string> = new EventEmitter<string>();

  displayedColumns: string[] = ['groupName', 'attachedUsers','totalPermissions', 'edit', 'delete'];

  constructor(public dialog: MatDialog) { }

  addCompanyGroup() {
    this.onUpdateSecurityGroup.emit(null);
  }

  updateSecurityGroup(group) {
    this.onUpdateSecurityGroup.emit(group);
  }

  deleteSecurityGroup(groupId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      heading: 'Deleting Group..?',
      description: errors.errors.deleteGroupPopup,
      actionButtonText: 'Delete'
    };

    const dialogRef = this.dialog.open(GlobalDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.onDeleteSecurityGroup.emit(groupId);
      }
    });
  }

}
