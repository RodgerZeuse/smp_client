import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutRoutingModule } from './layout.routes.module';
import { LayoutContainerComponent } from './layout-container/layout-container.component';
import { ContentContainerComponent } from './content-container/content-container.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MatGridListModule, MatIconModule, MatIcon, MatSidenavModule,MatListModule,MatProgressBarModule, MatFormFieldModule } from '@angular/material';
import {MaterialModule} from '../material.module';
import { DashboardService } from './services/dasboard.service';

import { SocialMediaAccountApi, SDKModels, LoopBackAuth, InternalStorage } from '../shared/sdk';
// import { MyNetworksContainerComponent } from './my-network/my-networks-container/my-networks-container.component';
// import { MyNetworkComponent } from './my-network/my-networks/my-networks.component';
// import { AddNetworksComponent } from './my-network/add-networks/add-networks.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileModule } from '../profile/profile.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    LayoutRoutingModule,
    MatGridListModule,
    MatIconModule,
    MaterialModule,
    MatSidenavModule,
    MatListModule,
    MatProgressBarModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    ProfileModule,
    SharedModule
  ],
  declarations: [LayoutContainerComponent, ContentContainerComponent,SidenavComponent],
  providers:[DashboardService,SocialMediaAccountApi,SDKModels,LoopBackAuth,InternalStorage],
  exports:[]
})
export class LayoutModule { }
