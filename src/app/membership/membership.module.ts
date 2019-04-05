import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterFormComponent } from './register-form/register-form.component';
import { RegisterContainerComponent } from './register-form/register-container.component'
import { LoginInformationComponent } from './register-form/login-information/login-information.component';
import { PersonalInformationComponent } from './register-form/personal-information/personal-information.component';
import { MembershipRoutingModule } from './membership.routes';
import { ChangePasswordComponent } from './Change-Pasword/change-password/change-password.component';
import { ChangePasswordContainerComponent } from './Change-Pasword/change-password-container/change-password-container.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { SignContainerComponent } from './Sign-In/sign-container.component';
import { MaterialModule } from '../material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SigninComponent } from './Sign-In/signin.component';
import { ForgetpasswordContainerComponent } from './forgetpassword-container/forgetpassword-container.component';
import { ResetPasswordContainerComponent } from './resetPassword/reset-password-container/reset-password-container.component';
import { ResetPasswordComponent } from './resetPassword/reset-password/reset-password.component';
import { MatGridListModule, MatProgressBarModule, MatIconModule } from '@angular/material';
import { OverlayModule } from '@angular/cdk/overlay';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MembershipRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatIconModule,
    SharedModule,
    OverlayModule,
    MatProgressBarModule
  ],
  declarations: [
    ChangePasswordComponent,
    ChangePasswordContainerComponent,
    ForgetPasswordComponent,
    ForgetpasswordContainerComponent,
    RegisterFormComponent,
    RegisterContainerComponent,
    LoginInformationComponent,
    PersonalInformationComponent,
    SignContainerComponent,
    SigninComponent,
    ResetPasswordContainerComponent,
    ResetPasswordComponent,

  ],
  providers: [FormBuilder],
  exports: [HttpClientModule]
})
export class MembershipModule { }
