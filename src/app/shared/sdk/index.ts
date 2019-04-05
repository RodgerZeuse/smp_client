/* tslint:disable */
/**
* @module SDKModule
* @author Jonathan Casarrubias <t:@johncasarrubias> <gh:jonathan-casarrubias>
* @license MIT 2016 Jonathan Casarrubias
* @version 2.1.0
* @description
* The SDKModule is a generated Software Development Kit automatically built by
* the LoopBack SDK Builder open source module.
*
* The SDKModule provides Angular 2 >= RC.5 support, which means that NgModules
* can import this Software Development Kit as follows:
*
*
* APP Route Module Context
* ============================================================================
* import { NgModule }       from '@angular/core';
* import { BrowserModule }  from '@angular/platform-browser';
* // App Root 
* import { AppComponent }   from './app.component';
* // Feature Modules
* import { SDK[Browser|Node|Native]Module } from './shared/sdk/sdk.module';
* // Import Routing
* import { routing }        from './app.routing';
* @NgModule({
*  imports: [
*    BrowserModule,
*    routing,
*    SDK[Browser|Node|Native]Module.forRoot()
*  ],
*  declarations: [ AppComponent ],
*  bootstrap:    [ AppComponent ]
* })
* export class AppModule { }
*
**/
import { ErrorHandler } from './services/core/error.service';
import { LoopBackAuth } from './services/core/auth.service';
import { LoggerService } from './services/custom/logger.service';
import { SDKModels } from './services/custom/SDKModels';
import { InternalStorage, SDKStorage } from './storage/storage.swaps';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CookieBrowser } from './storage/cookie.browser';
import { StorageBrowser } from './storage/storage.browser';
import { SocketBrowser } from './sockets/socket.browser';
import { SocketDriver } from './sockets/socket.driver';
import { SocketConnection } from './sockets/socket.connections';
import { RealTime } from './services/core/real.time';
import { UserApi } from './services/custom/User';
import { EmailApi } from './services/custom/Email';
import { RegisterUserApi } from './services/custom/RegisterUser';
import { CampaignApi } from './services/custom/Campaign';
import { ContainerApi } from './services/custom/Container';
import { SocialMediaAccountApi } from './services/custom/SocialMediaAccount';
import { PostApi } from './services/custom/Post';
import { CompanyMemberSocialAccountApi } from './services/custom/CompanyMemberSocialAccount';
import { ActivityStreamApi } from './services/custom/ActivityStream';
import { MediaFileAssetApi } from './services/custom/MediaFileAsset';
import { CommentsApi } from './services/custom/Comments';
import { TagApi } from './services/custom/Tag';
import { CompanyApi } from './services/custom/Company';
import { PostToQueueApi } from './services/custom/PostToQueue';
import { CampaignStatusApi } from './services/custom/CampaignStatus';
import { SlotApi } from './services/custom/Slot';
import { SingleUserApi } from './services/custom/SingleUser';
import { SlotTimeApi } from './services/custom/SlotTime';
import { CampaignStatusValuesApi } from './services/custom/CampaignStatusValues';
import { SystemPermissionsApi } from './services/custom/SystemPermissions';
import { SecurityGroupApi } from './services/custom/SecurityGroup';
import { ExternalUsersApi } from './services/custom/ExternalUsers';
import { InvitesApi } from './services/custom/Invites';
import { TaskManagerApi } from './services/custom/TaskManager';
import { PostAnalyticsApi } from './services/custom/PostAnalytics';
import { PaymentsApi } from './services/custom/Payments';
import { PaymentGatewayApi } from './services/custom/PaymentGateway';
import { CampaignArchiveApi } from './services/custom/CampaignArchive';
import { PostArchiveApi } from './services/custom/PostArchive';
/**
* @module SDKBrowserModule
* @description
* This module should be imported when building a Web Application in the following scenarios:
*
*  1.- Regular web application
*  2.- Angular universal application (Browser Portion)
*  3.- Progressive applications (Angular Mobile, Ionic, WebViews, etc)
**/
@NgModule({
  imports:      [ CommonModule, HttpClientModule ],
  declarations: [ ],
  exports:      [ ],
  providers:    [
    ErrorHandler,
    SocketConnection
  ]
})
export class SDKBrowserModule {
  static forRoot(internalStorageProvider: any = {
    provide: InternalStorage,
    useClass: CookieBrowser
  }): ModuleWithProviders {
    return {
      ngModule  : SDKBrowserModule,
      providers : [
        LoopBackAuth,
        LoggerService,
        SDKModels,
        RealTime,
        UserApi,
        EmailApi,
        RegisterUserApi,
        CampaignApi,
        ContainerApi,
        SocialMediaAccountApi,
        PostApi,
        CompanyMemberSocialAccountApi,
        ActivityStreamApi,
        MediaFileAssetApi,
        CommentsApi,
        TagApi,
        CompanyApi,
        PostToQueueApi,
        CampaignStatusApi,
        SlotApi,
        SingleUserApi,
        SlotTimeApi,
        CampaignStatusValuesApi,
        SystemPermissionsApi,
        SecurityGroupApi,
        ExternalUsersApi,
        InvitesApi,
        TaskManagerApi,
        PostAnalyticsApi,
        PaymentsApi,
        PaymentGatewayApi,
        CampaignArchiveApi,
        PostArchiveApi,
        internalStorageProvider,
        { provide: SDKStorage, useClass: StorageBrowser },
        { provide: SocketDriver, useClass: SocketBrowser }
      ]
    };
  }
}
/**
* Have Fun!!!
* - Jon
**/
export * from './models/index';
export * from './services/index';
export * from './lb.config';
export * from './storage/storage.swaps';
export { CookieBrowser } from './storage/cookie.browser';
export { StorageBrowser } from './storage/storage.browser';
