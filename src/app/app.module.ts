import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { DragAndDropModule } from "angular-draggable-droppable";
import { MaterialModule } from "./material.module";
import { FormsModule, FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { MobxAngularModule } from "mobx-angular";
import { AppRoutingModule } from "./app.routes.module";
import { CampaignService } from "./campaign/shared/service/campaign.service";
import { CampaignsStore } from "./store/campaigns-store";
import { UserProfile } from "./store/user-profile";
import { SocialAccountsStore } from "./store/social-accounts-store";
import { MatGridListModule, MatIconModule } from "@angular/material";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { HttpModule } from "../../node_modules/@angular/http";
import {
  RegisterUserApi,
  LoopBackAuth,
  SDKModels,
  InternalStorage
} from "./shared/sdk";
import { SDKBrowserModule } from "./shared/sdk";
import { MatDialogModule } from "@angular/material";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AngularFontAwesomeModule } from "angular-font-awesome";
import { SocketIoModule, SocketIoConfig } from "ng-socket-io";
import { WrappedSocket } from "ng-socket-io/dist/src/socket-io.service";
const url = require("./shared/config/urls.json").END_POINT_URL;
const config: SocketIoConfig = { url: url, options: {} };

@NgModule({
  declarations: [AppComponent],
  imports: [
    OwlDateTimeModule,
    MatDialogModule,
    OwlNativeDateTimeModule,
    BrowserModule,
    MaterialModule,
    FormsModule,
    DragAndDropModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MobxAngularModule,
    AppRoutingModule,
    HttpModule,
    MatGridListModule,
    AngularFontAwesomeModule,
    MatIconModule,
    NgbModule.forRoot(),
    SocketIoModule.forRoot(config),
    SDKBrowserModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  providers: [
    HttpClient,
    WrappedSocket,
    SocialAccountsStore,
    UserProfile,
    FormBuilder,
    CampaignService,
    CampaignsStore,
    RegisterUserApi,
    LoopBackAuth,
    SDKModels,
    InternalStorage
  ],

  bootstrap: [AppComponent],
  entryComponents: [],
  exports: [HttpClientModule, MobxAngularModule, DragAndDropModule]
})
export class AppModule {}
