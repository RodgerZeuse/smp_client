import { Component, OnInit } from '@angular/core';
import { ResetPassword } from '../../Model/changepassword';
import { AlertModel } from '../../../shared/model/alert.model';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { userLoginService } from '../../service/User-Login.service';
import { UserProfile } from '../../../store/user-profile';
let errors = require('../message.json')
@Component({
  selector: 'app-reset-password-container',
  templateUrl: './reset-password-container.component.html',
  styleUrls: ['./reset-password-container.component.css']
})
export class ResetPasswordContainerComponent implements OnInit {
  alertModel: AlertModel = new AlertModel();
  alertModel$ = new BehaviorSubject(this.alertModel);
 
  constructor(private resetPassword: userLoginService, private router: Router,public userProfile: UserProfile) { }
  onReset(changedPassword: ResetPassword) {
    this.userProfile.loaderStart();
    this.resetPassword.reset(changedPassword).subscribe(async result => {
      await this.userProfile.loaderEnd();
      this.alertModel.messages = [errors.errors.resetPasswordSuccess];
      this.alertModel$.next(this.alertModel);
      // this.router.navigateByUrl('/membership');
    },
      err => {
        this.userProfile.loaderEnd();
        this.alertModel.messages = [errors.errors.resetPasswordError];
        this.alertModel$.next(this.alertModel);
      });
  }


  ngOnInit() {
    // this.errors = require('./../../../shared/config/specificError.json').specificError;
  }

}
