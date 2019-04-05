import { Component, OnInit } from '@angular/core';
import { userLoginService } from '../../service/User-Login.service';
import { ResetPassword } from '../../Model/changepassword';
import { AlertModel } from '../../../shared/model/alert.model';
import { BehaviorSubject } from 'rxjs';
import { UserProfile } from '../../../store/user-profile';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { GlobalDialogComponent } from '../../../shared/global-dialog/global-dialog.component';
let errors = require('../message.json')
@Component({
  selector: 'app-change-password-container',
  templateUrl: './change-password-container.component.html',
  styleUrls: ['./change-password-container.component.css']
})

export class ChangePasswordContainerComponent implements OnInit {
  alertModel: AlertModel = new AlertModel();
  alertModel$ = new BehaviorSubject(this.alertModel);
  
  constructor(private resetPassword:userLoginService,public userProfile: UserProfile, private dialog: MatDialog) { }
  
  onReset(changedPassword:ResetPassword){
    this.userProfile.loaderStart();
    this.resetPassword.onChange(changedPassword).subscribe(async result => {
      await this.userProfile.loaderEnd();
      this.alertModel.messages = [errors.errors.changePasswordSuccess];
      
      this.openDialog();
  
    },
      err => {
        this.userProfile.loaderEnd();
        this.alertModel.messages = [errors.errors.changePasswordError];
        this.alertModel$.next(this.alertModel);
        
      });
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      heading: this.alertModel.messages,
      // description: 'Your password has been changed.',

    };
    const dialogRef = this.dialog.open(GlobalDialogComponent, dialogConfig);

  }
  ngOnInit() {
    // this.errors = require('./../../../shared/config/specificError.json').specificError;
    
  }
}

