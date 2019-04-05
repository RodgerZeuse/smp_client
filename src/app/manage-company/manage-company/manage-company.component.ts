import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CompanyUser } from '../user-model';
import { GlobalDialogComponent } from '../../shared/global-dialog/global-dialog.component';
import { UserProfile } from 'src/app/store/user-profile';
let errors = require('../message.json');

@Component({
  selector: 'manage-company',
  templateUrl: './manage-company.component.html',
  styleUrls: ['./manage-company.component.css']
})
export class ManageCompanyComponent implements OnInit {

  @Input() socialAccountsDetail$: Observable<Array<CompanyUser>>;
  @Output() onDeleteUser: EventEmitter<string> = new EventEmitter<string>();
  @Output() onUpdataUser: EventEmitter<CompanyUser> = new EventEmitter<CompanyUser>();

  icons: object;
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'edit', 'delete'];
  // 'signedAccounts',
  memberDetails: CompanyUser;

  constructor(public dialog: MatDialog, private profileStore: UserProfile) {
    this.memberDetails = new CompanyUser();
  }

  ngOnInit() {
    this.icons = require('./../../shared/config/icons.json').icons;
  }

  addCompanyUser() {
    this.onUpdataUser.emit(null);
  }

  updataCompanyUser(user: CompanyUser) {
    this.onUpdataUser.emit(user);
  }

  deleteUser(user) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      heading: 'Deleting Account..?',
      description: errors.errors.deleteUserPopup,
      actionButtonText: 'Delete'
    };

    const dialogRef = this.dialog.open(GlobalDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.onDeleteUser.emit(user);
      }
    });
  }
}
