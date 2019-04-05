import { observable } from "mobx-angular";

export class NetworksViewModel{
   @observable network:string;
   @observable id:string;
   @observable isActive:boolean;
   @observable profielimage:string;
   @observable groupsName:Array<string>;
   @observable socialAccountId:string;
   //@observable categories:Array<string>;
   //@observable members:Array<string>;
   @observable token:any;
   @observable groupId:Array<string>;
   @observable groupIcon:Array<string>;
   @observable instaAdAccountIcons:Array<string>;
   @observable instaAdAccountNames:Array<string>;
   @observable followers:number;
   @observable followersCount:number;
   @observable fbAdAccountIcons:Array<string>;
   @observable fbAdAccountNames:Array<string>;
   @observable adAccounts:Array<any>;
   @observable Groups:Array<any>;


}