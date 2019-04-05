import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { UserProfile } from '../../../store/user-profile';
import { Router } from '@angular/router';
import { ResetPassword } from '../../Model/changepassword';
import { Observable } from 'rxjs';
import { AlertModel } from '../../../shared/model/alert.model';
import { MatDialog } from "@angular/material";

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  @Output() onReset = new EventEmitter<ResetPassword>();
  @Input() alertModel$: Observable<AlertModel>;
  errors: any;
  currentPasswordError: boolean = false;
  newPasswordError: boolean = false;
  confirmPasswordError: boolean = false;
  resetPassword: ResetPassword;
  appLogo: object = {};


  constructor(private userProfileStore: UserProfile, private router: Router, private dialog: MatDialog) {
    this.resetPassword = new ResetPassword();
  }

  validatePassword(): boolean {
    if (!this.resetPassword.currentPassword && !this.resetPassword.newPassword && !this.resetPassword.confirmPassword) {
      this.currentPasswordError = true;
      this.newPasswordError = true;
      this.confirmPasswordError = true;
      return false;
    }
    else if (!this.resetPassword.currentPassword) {
      this.currentPasswordError = true;
      this.newPasswordError = false;
      this.confirmPasswordError = false;
      return false;
    }
    else if (!this.resetPassword.newPassword || this.resetPassword.newPassword.length < 4) {
      this.currentPasswordError = false;
      this.newPasswordError = true;
      this.confirmPasswordError = false;
      return false;
    }
    else if (!this.resetPassword.confirmPassword || this.resetPassword.confirmPassword.length < 4) {
      this.currentPasswordError = false;
      this.newPasswordError = false;
      this.confirmPasswordError = true;
      return false;
    }
    else if (this.resetPassword.newPassword != this.resetPassword.confirmPassword) {
      this.currentPasswordError = false;
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
      this.onReset.emit(this.resetPassword);
    }
  }

  ngOnInit() {
    this.errors = require('../message.json').errors;
    this.appLogo=require("./../../../shared/config/icons.json").AppLogo;
    //   if (this.userProfileStore.isLogin) {

    //   } else {
    //     this.router.navigateByUrl('membership/login');
    //   }
  }

}
