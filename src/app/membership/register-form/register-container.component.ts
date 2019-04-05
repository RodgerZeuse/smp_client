import { Component } from '@angular/core';
import { AlertModel } from '../../shared/model/alert.model';
import { BehaviorSubject } from 'rxjs';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { GlobalDialogComponent } from "../../shared/global-dialog/global-dialog.component";
import { Router } from '@angular/router';
import { RegisterUser } from '../../shared/sdk';
import { RegisterService } from '../service/register.service';
let errors = require('./message.json')
@Component({
  selector: 'register-container',
  templateUrl: './register-container.component.html',
})

export class RegisterContainerComponent {
  alertModel: AlertModel = new AlertModel();
  loading: boolean = false;
  user: RegisterUser;
  alertModel$ = new BehaviorSubject(this.alertModel);
  constructor(private regiterService: RegisterService, private router: Router, public dialog: MatDialog) {
  }

  registerUser(user: RegisterUser) {
    this.alertModel.messages.splice(0)
    this.loading = true;
    this.regiterService.registerUser(user).
      subscribe(result => {
        this.alertModel.isValidate = true;
        this.alertModel.messages.push(errors.errors.SignUpSuccess);
        this.alertModel$.next(this.alertModel);
        this.showRegisterationDialog();
      }, err => {
        this.alertModel.isValidate = false;
        this.loading = false;
        this.alertModel.messages.push(errors.errors.SignUpError);
        this.alertModel$.next(this.alertModel);
      });
  }

  toLogin() {
    this.router.navigateByUrl("membership");
  }

  showRegisterationDialog() {
    this.loading = false;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      heading: 'Registeration successfull',
      description: errors.errors.SignUpSuccess,
    }
    const dialogRef = this.dialog.open(GlobalDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if (data == 'close') {
          this.toLogin();
        }
      }
    );
  }

}
