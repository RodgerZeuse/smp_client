import { Injectable } from '@angular/core';
import { UserProfile } from '../store/user-profile';
import { BaseLoopBackApi, RegisterUserApi, PostApi } from '../shared/sdk/services';
import { RequestOptions, Http, Headers } from '@angular/http';
import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  config:any;
  constructor(private httpClient: HttpClient,
    public http: Http,
    public postApi: PostApi,
    public profileStore: UserProfile,
    private baseLoopbackApi: RegisterUserApi) {
this.config=require('./../shared/config/urls.json')
     }

  onUpdate(editData) {


    this.baseLoopbackApi.patchAttributes(this.profileStore.userId, editData).subscribe(result => {
      this.profileStore.updateProfile(result);


    })



  }
  logoutUser() {
    return this.baseLoopbackApi.logout().map(res => {

    });

  }
  uploadImage(profileImage) {
    let formData: FormData = new FormData();
    formData.append('uploadFile', profileImage, profileImage.name);
    let headers = new Headers();
    let options = new RequestOptions({ headers: headers });
    let apiUrl =  this.config.IMAGE_UPLOAD_END_POINT_URL;

    return this.http.post(apiUrl, formData, options).map((results: any) => {
      let res = JSON.parse(results._body)
      console.log(res.result.files.uploadFile[0].name);

      let body = {
        "profileImage": res.result.files.uploadFile[0].name
      }
      this.baseLoopbackApi.patchAttributes(this.profileStore.userId, body).subscribe(data => {
        this.profileStore.profilePic(res.result.files.uploadFile[0].name)

      })
      return results;
    }, err => {
      console.log("uploading error", err);
    });
  }
}
