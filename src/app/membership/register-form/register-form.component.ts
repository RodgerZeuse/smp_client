import { Component, Output, Input, ChangeDetectionStrategy, EventEmitter, OnInit } from '@angular/core';
import { AlertModel } from '../../shared/model/alert.model';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterUser } from '../../shared/sdk';

@Component({
  selector: 'register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class RegisterFormComponent implements OnInit {
  @Input() alertModel$: Observable<AlertModel>;
  @Output() registerUser = new EventEmitter<RegisterUser>();

  loginForm: FormGroup;
  personInformationForm: FormGroup;
  paymentInformationForm: FormGroup;
  user: RegisterUser;
  isEmailInvalid: boolean = false;
  isCompanyInvalid:boolean=false;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.user = new RegisterUser();
  }

  isEmailValidated(isEmailExist:boolean){
    this.isEmailInvalid=isEmailExist;
  }
  
  isCompanyValidated(isCompanyExist:boolean){
    this.isCompanyInvalid=isCompanyExist;
    // if(this.loginForm.controls.accountType.value=='company' && this.loginForm.controls.companyName.value ==''){

    // }
  }

  toLogin() {
    this.router.navigateByUrl("membership");
  }

  signUp() {
    if (this.user.cardNumber) {
      let cardNumber = this.user.cardNumber.replace(/[-]/g, '');
      this.user.cardNumber = cardNumber;
    }
    if (this.user.expiryDate) {
      let expiryDate = parseInt(this.user.expiryDate.toString().replace('/', ''));
      this.user.expiryDate = expiryDate;
    }
    this.registerUser.emit(this.user);
  }

  loginFormValidate() {
      this.loginForm = this.formBuilder.group({
        email: ['', Validators.compose([Validators.required, Validators.pattern("[a-z0-9.]+@[a-z$]+\.[a-z]{2,3}$")])],
        password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern("^[A-Za-z]+[0-9]{1,}")])],
        confirmPassword: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern("^[A-Za-z]+[0-9]{1,}")])],
        accountType: ['', Validators.required],
        companyName: ["", '']
      });
  }

  personInformationValidate() {
    this.personInformationForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.pattern("[A-Za-z]{3,}")])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.pattern("[A-Za-z]{3,}")])]
    });
  }

  paymentInformationValidate() {
    this.paymentInformationForm = this.formBuilder.group({
      cardNumber: ['', Validators.compose([Validators.required, Validators.minLength(16)])],
      expiryDate: ['', Validators.required],
      cardCvv: ["", Validators.compose([Validators.required, Validators.minLength(3)])]
    });
  }

  ngOnInit() {
    this.loginFormValidate();
    this.personInformationValidate();
    this.paymentInformationValidate();
  }
}

