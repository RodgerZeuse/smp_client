import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ResetPassword } from '../../Model/changepassword';
import { AlertModel } from '../../../shared/model/alert.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  appLogo: any;
  @Output() onReset = new EventEmitter<ResetPassword>();
  @Input() alertModel$: Observable<AlertModel>;

  newPasswordError: boolean = false;
  confirmPasswordError: boolean = false;
  resetPassword: ResetPassword;
  errors: any

  constructor(private router: Router) {
    this.resetPassword = new ResetPassword();
  }

  validatePassword(): boolean {
    if (!this.resetPassword.newPassword && !this.resetPassword.confirmPassword) {
      this.newPasswordError = true;
      this.confirmPasswordError = true;
      return false;
    }
    
    else if (!this.resetPassword.newPassword || this.resetPassword.newPassword.length<4) {
      this.newPasswordError = true;
      this.confirmPasswordError = false;
      return false;
    }
    else if (!this.resetPassword.confirmPassword || this.resetPassword.confirmPassword.length<4) {
      this.newPasswordError = false;
      this.confirmPasswordError = true;
      return false;
    }
    else if (this.resetPassword.newPassword != this.resetPassword.confirmPassword) {
      this.newPasswordError = true;
      this.confirmPasswordError = true;
      return false;
    }
    else {
      return true;
    }
  }
 


  reset() {
    let validateForm = this.validatePassword();
    if (validateForm) {
    this.resetPassword.accessToken = this.GetURLParameter("access_token");
      this.onReset.emit(this.resetPassword);
    }
  }
  GetURLParameter(sParam)
  {
      var sPageURL = window.location.href;
      console.log(sPageURL)
      var sURLVariables = sPageURL.split('?');
      for (var i = 0; i < sURLVariables.length; i++)
      {
          var sParameterName = sURLVariables[i].split('=');
          if (sParameterName[0] == sParam)
          {
            console.log(sPageURL)
              return sParameterName[1];
          }
      }
  }
  
  forLogin() {
    this.router.navigateByUrl('membership/login');
  }

  ngOnInit() {
    this.errors = require('../message.json').errors;
    this.appLogo =require("./../../../shared/config/icons.json").AppLogo
  }

}
