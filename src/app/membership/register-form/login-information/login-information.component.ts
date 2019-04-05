import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { RegisterUser } from '../../../shared/sdk';
import { RegisterService } from '../../service/register.service';

@Component({
  selector: 'login-information',
  templateUrl: './login-information.component.html',
  styleUrls: ['./login-information.component.css']
})
export class LoginInformationComponent {
  @Input() user: RegisterUser;
  @Input() loginForm: FormGroup;
  @Output() isEmailValidated: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isCompanyValidated: EventEmitter<boolean> = new EventEmitter<boolean>();
  emailExist: boolean = false;
  companyExist: boolean = false;
  errors: any;

  constructor(private registerService: RegisterService) {
  }

  ngOnInit() {
    this.errors = require('../message.json').errors;
  }

  validateEmail(email: string) {
    this.emailExist = false;
    this.registerService.validateEmail(email).subscribe(res => {
      this.emailExist = res;
      this.isEmailValidated.emit(this.emailExist)
    })
  }

  validateCompany(companyName: string) {
    this.companyExist = false;
    this.registerService.validateCompany(companyName).subscribe(res => {
      this.companyExist = res;
      this.isCompanyValidated.emit(this.companyExist)
    })
  }

  changeType() {
    if (this.user.account_type == "individual") {
      this.user.hasCompany = false;
      this.user.companyName = ''
      this.loginForm.controls['companyName'].clearValidators();
      this.loginForm.controls['companyName'].updateValueAndValidity();
      this.isCompanyValidated.emit(false)
    }
    else if (this.user.account_type == "company") {
      this.user.hasCompany = true;
      this.loginForm.controls['companyName'].setValidators(Validators.required);
      this.loginForm.controls['companyName'].updateValueAndValidity();
    }
  }
}
