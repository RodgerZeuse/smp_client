import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ManageCompanyContainerComponent } from './manage-company-container/manage-company-container.component';

export const routes: Routes = [
    { path: '', component: ManageCompanyContainerComponent, data: { name: "Manage Company" } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManageCompanyRoutingModule { }