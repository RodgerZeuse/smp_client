import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { LoginData } from './user/logindata';
import { AlertModel } from '../../shared/model/alert.model';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit {
  appLogo: object = {};
  @Input() alertModel$: Observable<AlertModel>;
  @Output() onLogin = new EventEmitter<LoginData>();
  loginForm: FormGroup;
  errors: any
  emailError: boolean = false;
  paswordError: boolean = false;
  loginData: LoginData;
  loginButtonDisable: boolean = true;
  constructor(private formBuilder: FormBuilder) {
    this.loginData = new LoginData();
  }

  ngOnInit() {
    this.errors = require('./message.json').errors;
    this.appLogo = require("./../../shared/config/icons.json").AppLogo;
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern("[a-z0-9.]+@[a-z$]+\.[a-z]{2,3}$")])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  validateForm(): boolean {
    if (!this.loginData.email && !this.loginData.password) {
      this.emailError = true;
      this.paswordError = true;
      return false;
    }
    else if (!this.loginData.email) {
      this.emailError = true;
      this.paswordError = false;
      return false;
    }
    else if (!this.loginData.password) {
      this.emailError = false;
      this.paswordError = true;
      return false;
    }
    else {
      return true;
    }
  }

  login() {
    let validateForm = this.validateForm();
    if (validateForm) {
      this.loginButtonDisable = false;
      this.onLogin.emit(this.loginData);
    }
  }
}