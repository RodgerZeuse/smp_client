import { Injectable } from "@angular/core";
import { forkJoin, Subject, observable } from "rxjs";
import { Observable } from "rxjs/Observable";
import { Http, RequestOptions, Headers } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { UserProfile } from "./../../../store/user-profile";
import "rxjs/add/operator/map";
import {
  CampaignApi,
  ContainerApi,
  PostApi,
  RegisterUserApi,
  Campaign
} from "./../../../shared/sdk";
// import { CampaignsStore } from '../../store/campaigns-store'
// import { CampaignApi, ContainerApi, PostApi, RegisterUserApi, Campaign } from "./../../../shared/sdk";
import { CampaignsStore } from "../../../store/campaigns-store";
import { Post } from "src/app/shared/sdk/models";
import { Socket } from "ng-socket-io";
import { MediaFileAssetViewModel } from "../models/mediaFileAssetViewModel";
import { relative } from "path";
import { CampaignListViewModel } from "../models/campaignListViewModel";
@Injectable({
  providedIn: "root"
})
export class CampaignService {
  subject: Subject<any> = new Subject<any>();
  observable: Observable<any> = this.subject.asObservable();

  constructor(
    private socket: Socket,
    private httpClient: HttpClient,
    public http: Http,
    public campaignApi: CampaignApi,
    public containerApi: ContainerApi,
    public postApi: PostApi,
    public userApi: RegisterUserApi,
    public myCampaignsStore: CampaignsStore,
    public profileStore: UserProfile
  ) {}

  public createCampaign(camapaign: Campaign) {
    return this.campaignApi.create(camapaign).map(
      createdCampaign => {
        console.log("created", createdCampaign);
        return createdCampaign;
      },
      err => {
        return err;
      }
    );
  }

  createPosts(postsArray, createdCampaign) {
    let apiUrl: Array<any> = [];
    postsArray.forEach(element => {
      // let accountId = element.socialAccountObj.id
      apiUrl.push(this.campaignApi.createPosts(createdCampaign.id, element));
    });

    return forkJoin(apiUrl).map(
      results => {
        return results;
      },
      err => {
        console.log("delete error", err);
        return err;
      }
    );
  }

  uploadCroppedImage(mediaFiles: Array<MediaFileAssetViewModel>) {
    let apiCall: Array<any> = [];
    for (let i = 0; i < mediaFiles.length; i++) {
      let formData: FormData = new FormData();
      console.log("file type in service", mediaFiles[i].file.type);
      formData.append(
        "uploadFile",
        mediaFiles[i].file,
        mediaFiles[i].file.name
      );
      let headers = new Headers();
      let options = new RequestOptions({ headers: headers });
      let uploadFilePath = require("./../../../shared/config/urls.json")
        .CROPPED_IMAGE_UPLOAD_END_POINT_URL;
      apiCall.push(
        this.http.post(
          uploadFilePath + `?network=${mediaFiles[i].network}`,
          formData,
          options
        )
      );
      console.log(apiCall);
    }
    return forkJoin(apiCall).map(
      results => {
        return results;
      },
      err => {
        console.log("uploading error", err);
      }
    );
  }

  uploadImageNew(mediaFiles: Array<MediaFileAssetViewModel>) {
    let formData: FormData = new FormData();
    let apiCall: Array<any> = [];
    for (let i = 0; i < mediaFiles.length; i++) {
      console.log("file type in service", mediaFiles[i].file.type);
      formData.append(
        "uploadFile",
        mediaFiles[i].file,
        mediaFiles[i].file.name
      );
      let headers = new Headers();
      let options = new RequestOptions({ headers: headers });
      let uploadFilePath = require("./../../../shared/config/urls.json")
        .IMAGE_UPLOAD_END_POINT_URL;
      apiCall.push(this.http.post(uploadFilePath, formData, options));
    }
    return forkJoin(apiCall).map(
      results => {
        return results;
      },
      err => {
        console.log("uploading error", err);
      }
    );
  }

  uploadImage(mediaFiles) {
    let formData: FormData = new FormData();
    let apiCall: Array<any> = [];
    for (let i = 0; i < mediaFiles.length; i++) {
      console.log("file type in service", mediaFiles[i].type);
      formData.append("uploadFile", mediaFiles[i], mediaFiles[i].name);
      let headers = new Headers();
      let options = new RequestOptions({ headers: headers });
      let uploadFilePath = require("./../../../shared/config/urls.json")
        .IMAGE_UPLOAD_END_POINT_URL;
      apiCall.push(this.http.post(uploadFilePath, formData, options));
    }
    return forkJoin(apiCall).map(
      results => {
        return results;
      },
      err => {
        console.log("uploading error", err);
      }
    );
  }

  editCampaign(campaignId, campaign: Campaign) {
    return this.campaignApi
      .findById(campaignId)
      .switchMap((getCampaign: Campaign) => {
        getCampaign.description = campaign.description;
        getCampaign.hashTags = campaign.hashTags;
        getCampaign.title = campaign.title;
        getCampaign.scheduledAt = campaign.scheduledAt;
        getCampaign.state = campaign.state;
        getCampaign.mediaFiles = campaign.mediaFiles;
        getCampaign.type = campaign.type;
        return this.campaignApi.updateAttributes(campaignId, getCampaign);
      })
      .map(res => {
        console.log(res);
        return res;
      });
  }

  updateCamapign(campaignId, imagesObject) {
    // campaign.mediaFiles = imagesObject;
    return this.campaignApi
      .patchAttributes(campaignId, { mediaFiles: imagesObject })
      .map(
        res => {
          console.log(res);
          return res;
        },
        err => {
          console.log(err);
        }
      );
  }

  getCamapign() {
    return this.campaignApi
      .find({
        include: [
          {
            relation: "posts",
            scope: {
              fields: [
                "id",
                "socialMediaAccountId",
                "socialMediaInfo",
                "network",
                "error",
                "type",
                "state",
                "mediaFiles",
                "description"
              ],
              include: {
                relation: "socialMediaAccounts",
                scope: {
                  fields: [
                    "id",
                    "type",
                    "userName",
                    "pictureThumbnail",
                    "smPages",
                    "smGroups",
                    "statusId"
                  ]
                }
              }
            }
          }
        ]
      })
      .map((response: Array<Campaign>) => {
        this.myCampaignsStore.setCampaigns(response);
        return response;
      });
  }

  getCampaignForEdit(id: string) {
    let post = {
      relation: "posts",
      scope: {
        fields: [
          "socialMediaAccountId",
          "socialMediaInfo",
          "id",
          "campaignId",
          "network",
          "error",
          "state",
          "mediaFiles",
          "description",
          "type",
          "socialMediaAccountId",
          "statusId"
        ],
        include: [{ relation: "socialMediaAccounts" }]
      }
    };
    return this.campaignApi.findById(id).map((response: Campaign) => {
      return response;
    });
  }

  getCampaignForExternalFeedBack(id: string) {
    let post = {
      relation: "posts",
      scope: {
        fields: [
          "socialMediaAccountId",
          "socialMediaInfo",
          "id",
          "campaignId",
          "network",
          "error",
          "status",
          "type",
          "mediaFiles",
          "statusId"
        ],
        include: [{ relation: "socialMediaAccounts" }]
      }
    };
    return this.campaignApi
      .findById(id, { include: [post, { campaignComments: "registerUser" }] })
      .map(
        (response: Array<Campaign>) => {
          return response;
        },
        error => {
          console.log("comment error", error);
        }
      );
  }

  removeCampaign(campaign: any) {
    let postsToDelete;
    let mediaFilesToDelte;
    if (campaign.mediaFiles && campaign.mediaFiles.length > 0) {
      mediaFilesToDelte = campaign.mediaFiles.map(x => x.name);
      let thumbnailsToDelete = campaign.mediaFiles.map(x => x.thumbnailName);
      mediaFilesToDelte = mediaFilesToDelte.concat(thumbnailsToDelete);
      let croppedImagestoDelete = [];
      postsToDelete = campaign.posts.map(x => x.id);
      campaign.posts.forEach(post => {
        croppedImagestoDelete = post.mediaFiles
          .filter(x => x.isCropped == true)
          .map(x => x.name);
      });
      mediaFilesToDelte = mediaFilesToDelte.concat(croppedImagestoDelete);
    }
    return this.campaignApi
      .deleteById(campaign.id)
      .flatMap((responce: any) => {
        this.myCampaignsStore.removeCampaign(campaign);
        if (campaign.posts.length > 0) {
          return this.removePosts(postsToDelete);
        } else {
          return Observable.of([]);
        }
      })
      .flatMap((response: any) => {
        if (mediaFilesToDelte.length > 0) {
          return this.removeMediaFilesfromContainer(mediaFilesToDelte);
        } else {
          return Observable.of([]);
        }
      })
      .map(
        (response: any) => {
          return Observable.of(true);
        },
        err => {
          return Observable.of(err);
        }
      );
  }

  rescheduleCampaign(id: string | number, newDate: Date) {
    return this.campaignApi
      .patchAttributes(id, { scheduledAt: newDate })
      .map(res => {
        this.myCampaignsStore.rescheduleCampaign(id, newDate);
      });
  }

  searchCampains(criteria: object) {
    let post = {
      relation: "posts",
      scope: {
        fields: [
          "socialMediaAccountId",
          "id",
          "socialMediaInfo",
          "network",
          "error",
          "state",
          "mediaFiles",
          "statusId"
        ],
        include: [
          {
            relation: "socialMediaAccounts",
            scope: {
              fields: [
                "id",
                "type",
                "userName",
                "pictureThumbnail",
                "smPages",
                "smGroups"
              ]
            }
          }
        ]
      }
    };
    if (criteria == null) {
      // return this.userApi.getCampaigns(this.profileStore.userId, {
      //   "include": [post, 'campaignStatuses']
      // }).map((response: Array<Campaign>) => {
      //   this.myCampaignsStore.setCriteria(criteria);
      //   this.myCampaignsStore.setCampaigns(response);
      //   return response;
      // });
      return this.campaignApi.find().map((response: Array<Campaign>) => {
        this.myCampaignsStore.setCriteria(criteria);
        this.myCampaignsStore.setCampaigns(response);
        return response;
      });
    } else {
      // return this.userApi.getCampaigns(this.profileStore.userId, {
      //   where: criteria, "include": [post, 'campaignStatuses']
      // }).map((response: Array<Campaign>) => {
      //   this.myCampaignsStore.setCriteria(criteria);
      //   this.myCampaignsStore.setCampaigns(response);
      //   return response;
      // });
      return this.campaignApi
        .find({ where: criteria })
        .map((response: Array<Campaign>) => {
          this.myCampaignsStore.setCriteria(criteria);
          this.myCampaignsStore.setCampaigns(response);
          console.log("Res", response);
          return response;
        });
    }
  }

  removeMediaFilesfromContainer(fileNames: Array<string>) {
    if (fileNames.length >= 1) {
      let apiCall: Array<any> = [];
      for (let i = 0; i < fileNames.length; i++) {
        apiCall.push(this.containerApi.removeFile("pics", fileNames[i]));
      }
      return forkJoin(apiCall).map(
        results => {
          return results;
        },
        err => {
          console.log("media files removing error", err);
        }
      );
    } else {
      return Observable.of(null);
    }
  }

  removePosts(postsIds: Array<string>) {
    let apiCall: Array<any> = [];
    for (let i = 0; i < postsIds.length; i++) {
      apiCall.push(this.postApi.deleteById(postsIds[i]));
    }
    return forkJoin(apiCall).map(
      results => {
        return results;
      },
      err => {
        console.log("account removing error", err);
      }
    );
  }

  updatePosts(posts: Array<Post>) {
    let apiCall: Array<any> = [];

    posts.forEach((post, index) => {
      apiCall.push(
        this.postApi.patchAttributes(post.id, {
          description: post.description,
          scheduleDate: post.scheduleDate,
          mediaFiles: post.mediaFiles,
          state: post.state
        })
      );
    });
    return forkJoin(apiCall).map(
      results => {
        return results;
      },
      err => {
        console.log("post updating error", err);
      }
    );
  }

  sendMessage(msg: string) {
    return this.socket.emit("comments", msg);
  }

  getCommentsFromSocket() {
    return this.socket.fromEvent<any>("comments").map(data => data.msg);
  }

  getComments(id) {
    return this.campaignApi
      .findById(id, {
        include: { campaignComments: ["registerUser", "externalUsers"] }
      })
      .map(
        (response: Array<Campaign>) => {
          this.myCampaignsStore.addCampaignCommnets(response);
          return response;
        },
        error => {
          console.log("comment error", error);
        }
      );
  }
}
