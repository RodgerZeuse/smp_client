import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignContainerComponent } from './Sign-In/sign-container.component';
import { RegisterContainerComponent } from './register-form/register-container.component';
import { ForgetpasswordContainerComponent } from './forgetpassword-container/forgetpassword-container.component';
import { ResetPasswordContainerComponent } from './resetPassword/reset-password-container/reset-password-container.component';
import { ChangePasswordContainerComponent } from './Change-Pasword/change-password-container/change-password-container.component';
import {
    AuthService as AuthGuard
} from './../auth.service';

export const routes: Routes = [
    { path: '', component: SignContainerComponent },
    { path: 'login', component: SignContainerComponent },
    { path: 'forgetpassword', component: ForgetpasswordContainerComponent },
    { path: 'signup', component: RegisterContainerComponent },
    { path: 'reset-password', component: ResetPasswordContainerComponent},
    { path: 'change-password', component: ChangePasswordContainerComponent, canActivate: [AuthGuard] },
    // { 
    //     path: 'profile',
    //     component: ProfileComponent,
    //     canActivate: [AuthGuard] 
    //   },
    //   { path: 'change-password', redirectTo: 'membership'}

];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MembershipRoutingModule { }