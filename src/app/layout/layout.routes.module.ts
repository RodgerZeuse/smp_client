import { Routes, RouterModule } from "@angular/router";
import { NgModule, Component } from "@angular/core";
import { LayoutContainerComponent } from "./layout-container/layout-container.component";

export const routes: Routes = [
  {
    path: "",
    component: LayoutContainerComponent,
    children: [
      {
        path: "campaign",
        loadChildren: "../campaign/campaign.module#CampaignModule"
      },
      {
        path: "my-networks",
        loadChildren: "../my-network/my-networks.module#MyNetworksModule"
      },
      {
        path: "profile",
        loadChildren: "../profile/profile.module#ProfileModule"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}
