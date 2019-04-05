import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LoginData } from '../Sign-In/user/logindata';
import { Observable } from 'rxjs';
import { AlertModel } from '../../shared/model/alert.model';
import { Router } from '@angular/router';

@Component({
  selector: 'forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})

export class ForgetPasswordComponent implements OnInit {
  appLogo: object = {};
  @Output() onForget = new EventEmitter<string>();
  @Input() alertModel$: Observable<AlertModel>;
  loginData: LoginData;
  emailError: boolean = false;
  errors: any;
  constructor(private router: Router) {
    this.loginData = new LoginData();
  }
  validateEmail(): boolean {
    if (!this.loginData.email) {
      this.emailError = true;
      return false;
    }
    else {
      return true;
    }
  }
  getEmail() {
    let validateEmail = this.validateEmail();
    if (validateEmail) {
      this.onForget.emit(this.loginData.email)
    }
  }

  ngOnInit() {
    this.errors = require('../forgetpassword-container/message.json').errors;
    this.appLogo = require("./../../shared/config/icons.json").AppLogo.appLogo
  }



}




