
import { Routes, RouterModule } from '@angular/router';
import { NgModule, Component } from '@angular/core';
import { LayoutContainerComponent } from './layout-container/layout-container.component';

export const routes: Routes = [
    {
        path: '', component: LayoutContainerComponent, children: [
            { path: 'campaign', loadChildren: "../campaign/campaign.module#CampaignModule" },
            { path: 'my-networks', loadChildren: "../my-network/my-networks.module#MyNetworksModule" },
            { path: 'campaign-status', loadChildren: "../campaign/custom-campaign-status/camapignStatus.module#CampaignStatusModule" },
            { path: 'profile', loadChildren: "../profile/profile.module#ProfileModule" },
            { path: 'manage-company', loadChildren: "../manage-company/manage-company.module#ManageCompanyModule" },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }