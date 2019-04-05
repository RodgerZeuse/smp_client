import { Component, OnInit } from '@angular/core';
import { AlertModel } from '../../shared/model/alert.model';
import { BehaviorSubject } from 'rxjs';
import { userLoginService } from '../service/User-Login.service';
import { UserProfile } from '../../store/user-profile';
let errors = require('./message.json')
@Component({
  selector: 'app-forgetpassword-container',
  templateUrl: './forgetpassword-container.component.html',
  styleUrls: ['./forgetpassword-container.component.css']
})
export class ForgetpasswordContainerComponent implements OnInit{
  alertModel: AlertModel = new AlertModel();
  alertModel$ = new BehaviorSubject(this.alertModel);
  constructor(private forgetPassword: userLoginService,public userProfile: UserProfile) { }
  onForget(email: string) {
    this.userProfile.loaderStart();
    this.forgetPassword.givePassword(email).subscribe(async result => {
      await this.userProfile.loaderEnd();
      this.alertModel.messages = [errors.errors.forgetPasswordSuccess];
      this.alertModel$.next(this.alertModel);
    },
      err => {
        this.userProfile.loaderEnd();
        this.alertModel.messages = [errors.errors.forgetPasswordError];
        this.alertModel$.next(this.alertModel);
      });
      
  }
  ngOnInit() {
    // this.errors = require('./../../shared/config/specificError.json').specificError;
    
  }
}
