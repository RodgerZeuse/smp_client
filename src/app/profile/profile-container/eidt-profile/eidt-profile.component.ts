import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { EditProfile } from '../../editProfile-model';
import { RegisterUser } from '../../../shared/sdk';
import { UserProfile } from '../../../store/user-profile';

@Component({
  selector: 'eidt-profile',
  templateUrl: './eidt-profile.component.html',
  styleUrls: ['./eidt-profile.component.css']
})
export class EidtProfileComponent implements OnInit {

  @Output() onUpdate = new EventEmitter<EditProfile>();
  paymentInformationForm: FormGroup;
  isPaymentMethodShow: boolean;
  editProfile: EditProfile;
  user: RegisterUser;
  emailError: boolean = false;
  fNameError: boolean = false;
  fNameLengthError:boolean=false;
  lNameLengthError:boolean=false;
  lNameError: boolean = false;
  email = new FormControl('');
  errors:any;
  constructor(private _formBuilder: FormBuilder, public router: Router, private userProfile:UserProfile) {
    this.user = new RegisterUser();
    this.editProfile = new EditProfile();
  }


  loginForm: FormGroup = this._formBuilder.group({
    username: this.email
   
  });
  ngOnInit() {
    this.errors=require('../message.json').errors;
    this.editProfile.firstName=this.userProfile.firstName;
    this.editProfile.lastName=this.userProfile.lastName;
    this._formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern("[a-z0-9.]+@[a-z$]+\.[a-z]{2,3}$")])],
      // email: ['', Validators.compose([Validators.required,Validators.pattern("[a-z0-9.]+@[a-z$]+\.[a-z]{2,3}$")])]

    });

    this.isPaymentMethodShow = false;
    this.paymentInformationForm = this._formBuilder.group({
      cardNumber: ['', Validators.compose([Validators.required, Validators.minLength(16)])],

      expiryDate: ['', Validators.required],
      cardCvv: ["", Validators.compose([Validators.required, Validators.minLength(3)])]
    });
  }
  validateForm(): boolean {
    if (!this.editProfile.firstName && !this.editProfile.lastName) {
      this.fNameError = true;
      this.lNameError = true;

      return false;
    }
    else if (this.editProfile.firstName.length<=4) {
      this.lNameError = false;
      this.fNameError=true;;
      return false;
    }
    else if (this.editProfile.lastName.length<=4) {
      this.lNameError = true;
      this.fNameError=false;
      return false;
    }
    else {
    return true;
    }
  }
  update() {
    let validateForm = this.validateForm();
    if (validateForm) {
    this.onUpdate.emit(this.editProfile);
    }

  }
  paymentMethodShow() {
    this.isPaymentMethodShow = !this.isPaymentMethodShow;
  }
  gotoChangePassword() {
    this.router.navigateByUrl("membership/change-password")
  }
}
