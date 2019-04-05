import {Routes, RouterModule} from '@angular/router';
import {
    AuthService as AuthGuard
} from './auth.service';
import { NgModule } from '@angular/core';
import {FeaturesModule} from './features/features.module'
export const routes:Routes=[
    {path:'membership', loadChildren:"./membership/membership.module#MembershipModule"},
    // {path:'',loadChildren:"./layout/layout.module#LayoutModule", canActivate: [AuthGuard]},
    {path:'',loadChildren:"./layout/layout.module#LayoutModule"},
    {path:'campaign-feedback',loadChildren:"./features/features.module#FeaturesModule"},
    // {path:'campaign-feedback',loadChildren:"./features/features.module#FeaturesModule",canActivate: [AuthGuard]},
    
    // { path: '**', redirectTo: 'membership',canActivate: [AuthGuard] }
   ];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }