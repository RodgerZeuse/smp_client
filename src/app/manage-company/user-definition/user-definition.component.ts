import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { CompanyUser } from './../user-model';
import { FormControl } from '@angular/forms';
import { Validators, FormGroup } from '@angular/forms';
import { UserProfile } from '../../store/user-profile';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'user-definition',
  templateUrl: './user-definition.component.html',
  styleUrls: ['./user-definition.component.css']
})

export class UserDefinitionComponent implements OnInit {

  onUpdateAccount = new EventEmitter();
  permissions: Array<any>
  userForm: FormGroup;
  dialogBoxType: string = '';
  emailExist: boolean = false;

  constructor(public dialogRef: MatDialogRef<UserDefinitionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public companyUser: CompanyUser, private profileStore: UserProfile) {
  }

  ngOnInit() {
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern("^[A-Za-z]+[0-9]{1,}")]))
    })
    if (this.data != null && this.data.data) {
      this.dialogBoxType = "Edit";
      this.companyUser.id = this.data.data.id
      this.companyUser.firstName = this.data.data.firstName,
        this.companyUser.lastName = this.data.data.lastName,
        this.companyUser.email = this.data.data.email,
        this.companyUser.password = '',
        this.companyUser.account_type = this.data.data.account_type;
    }
    else {
      this.dialogBoxType = "Add"
      this.companyUser = new CompanyUser();
    }
  }

  addOrUpdateUser() {
    this.companyUser.email = this.userForm.controls.email.value;
    this.companyUser.firstName = this.userForm.controls.firstName.value;
    this.companyUser.lastName = this.userForm.controls.lastName.value;
    this.companyUser.password = this.userForm.controls.password.value;
    this.onUpdateAccount.emit(this.companyUser);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
