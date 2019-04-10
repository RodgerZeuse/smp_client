import { Injectable } from "@angular/core";
import { forkJoin, Subject } from "rxjs";
import { Observable } from "rxjs/Observable";
import { Http, RequestOptions, Headers } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";

// import { read } from 'fs';
@Injectable({
  providedIn: "root"
})
export class SharedService {
  subject: Subject<any> = new Subject<any>();
  observable: Observable<any> = this.subject.asObservable();

  constructor(private httpClient: HttpClient, public http: Http) {}

  //   getCampaignActivityStream(id){
  //     if(localStorage["userProfile"]){
  //         let profile = JSON.parse(localStorage["userProfile"]);
  //       return  this.activityStream.find({"where":{and:[{"registerUserId":profile.userId},{"campaignId":id}]},"include":"registerUser"}).map(res =>{
  //           return res;
  //       })
  //     }
  // }
}
