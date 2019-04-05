import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileContainerComponent } from './profile-container/profile-container.component';
import {
    AuthService as AuthGuard
} from './../auth.service';



export const routes:Routes=[
    {path:'', component:ProfileContainerComponent,data:{name:"Profile"}, canActivate: [AuthGuard]}  
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule { }