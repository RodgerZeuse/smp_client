import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { MyNetworksContainerComponent } from "./my-networks-container/my-networks-container.component";
export const routes: Routes = [
  {
    path: "",
    component: MyNetworksContainerComponent,
    data: { name: "My Networks" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyNetworksRoutingModule {}
