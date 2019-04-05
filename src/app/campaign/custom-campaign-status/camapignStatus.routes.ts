import {Routes, RouterModule} from '@angular/router';
import { NgModule,  } from '@angular/core';
import { CampaignStatusContainerComponent } from './campaign-status-container/campaign-status-container.component';
export const routes:Routes=[
    
    {path:'',component:CampaignStatusContainerComponent,data:{name:"Campaign Status"}},
//    {path:'creat-campaign-status', component:CreateCampaignStatusComponent,data:{name:"Create Campaign Status"}},
//    {path:'edit-status',component:EditCampaignStatusComponent,data:{name:"Edit Campaign Status"}},
//    {path:'grid-status',component:GridCampaignStatusComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class CamapignStatusRoutingModule { }