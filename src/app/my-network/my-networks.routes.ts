import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MyNetworksContainerComponent } from './my-networks-container/my-networks-container.component';
import { AttachedAccountsDetailsContainerComponent } from './attached-accounts-details-container/attached-accounts-details-container.component';

export const routes: Routes = [
    { path: '', component: MyNetworksContainerComponent, data: { name: "My Networks" } },
    { path: 'network/details', component: AttachedAccountsDetailsContainerComponent, data: { name: "Networks Details" } }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyNetworksRoutingModule { }