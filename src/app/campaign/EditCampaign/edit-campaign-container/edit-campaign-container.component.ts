import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from "@angular/core";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { EmptyObservable } from "rxjs/observable/EmptyObservable";
import { CampaignService } from "./../../shared/service/campaign.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Campaign } from "../../../shared/sdk";
// import { CampaignModel } from '../../campaign-definition/model/createCampaign.model';
import { GlobalDialogComponent } from "../../../shared/global-dialog/global-dialog.component";
import { MatDialogConfig, MatDialog, MatSnackBar } from "@angular/material";
import { UserProfile } from "./../../../store/user-profile";
import { SocialAccountsStore } from "./../../../store/social-accounts-store";
import * as _ from "lodash";
import { SocialAccountForCreate } from "./../../shared/components/my-attached-social-networks/model/social-account-for-create.model";
import { MyNetworkService } from "../../../membership/service/my-network.service";
import { retry, concat } from "rxjs/operators";
import { Post } from "src/app/shared/sdk/models";
import { subDays } from "date-fns";
import { observable } from "mobx";
import "rxjs/add/observable/of";
import { EditCampaignViewModel } from "./model/editCampaignViewModel";
import { FileToUploadModel } from "../../shared/components/campaign-definition/model/fileToUploadModel";
import { UUID } from "angular2-uuid";
import { CampaignStatusEnum } from "../../shared/components/campaign-definition/model/status.model";
import { CampaignSocialAccountsService } from "../../shared/service/campaign-social-accounts.service";

import { Socket } from "ng-socket-io";
import { CampaignsStore } from "../../../store/campaigns-store";
import { CampaignViewModel } from "./../../shared/models/campaignViewModel";
import { CampaignContainerService } from "../../shared/service/campaign-container.service";
import { PostViewModel } from "../../shared/models/postViewModel";
import { MediaFileAssetViewModel } from "../../shared/models/mediaFileAssetViewModel";
import { MediaAssetConversionUtil } from "../../../shared/mediaAssetUtil/mediaAssetConversionUtil";

@Component({
  selector: "edit-campaign-container",
  templateUrl: "./edit-campaign-container.component.html",
  styleUrls: ["./edit-campaign-container.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCampaignContainerComponent implements OnInit {
  campaignViewModel: CampaignViewModel;
  postsArrayToShow$: BehaviorSubject<Array<PostViewModel>>;
  selectedNetworks$: BehaviorSubject<Array<string>>;
  imagePath: any;
  myAttachedSocialAccounts$ = new BehaviorSubject(
    this.socialAccountsStore.socialAccounts
  );
  persistCampaign: Campaign;
  persistCampaign$ = new BehaviorSubject(this.campaignViewModel);
  editCampaignViewModel: EditCampaignViewModel;

  selectedSocialAccountsArtifactsArray: Array<SocialAccountForCreate> = [];
  selectedSocialAccountsArtifactsArray$ = new BehaviorSubject(
    this.selectedSocialAccountsArtifactsArray
  );
  isCommentsShow: boolean;
  commentsType: string;
  campaignComments$ = new BehaviorSubject(this.campaignStore.campaignComments);
  groupRights = require("../../../shared/config/group-rights.json").groupRights;

  constructor(
    public socket: Socket,
    public campaignContainerService: CampaignContainerService,
    public ref: ChangeDetectorRef,
    public campaignNetworkService: CampaignSocialAccountsService,
    private dialog: MatDialog,
    public socialAccountService: MyNetworkService,
    public snackBar: MatSnackBar,
    private _Activatedroute: ActivatedRoute,
    private _router: Router,
    public profileStore: UserProfile,
    public socialAccountsStore: SocialAccountsStore,
    public campaignService: CampaignService,
    public campaignStore: CampaignsStore,
    public mediaAssetUtil: MediaAssetConversionUtil
  ) {
    this.editCampaignViewModel = new EditCampaignViewModel();
    this.campaignStore.resetCampaignComments();
    this.getMessage();
    this.campaignViewModel = new CampaignViewModel();
    this.postsArrayToShow$ = new BehaviorSubject(this.campaignViewModel.posts);
    this.selectedNetworks$ = new BehaviorSubject([]);
  }

  async fillFiles() {
    let files = await this.campaignContainerService.fileRead(
      false,
      true,
      this.campaignViewModel.mediaFiles
    );
    if (files) {
      this.persistCampaign$.next(this.campaignViewModel);
    }
  }
  ngOnInit() {
    this.imagePath = require("./../../../shared/config/urls.json").IMAGE_DOWNLOAD_END_POINT_URL;
    this.isCommentsShow = false;
    this.getSocialnetwork();
    this.profileStore.loaderStart();
    this.editCampaignViewModel.id = this._Activatedroute.snapshot.queryParams[
      "id"
    ];
    this.campaignService
      .getCampaignForEdit(this.editCampaignViewModel.id)
      .subscribe((res: Campaign) => {
        this.persistCampaign = res;
        this.campaignViewModel.populateFromServerModel(this.persistCampaign);
        console.log(
          "persist to view from edit container",
          this.campaignViewModel
        );
        if (this.campaignViewModel.mediaFiles.length > 0) {
          this.fillFiles();
          // let files = this.fillFiles(this.campaignViewModel.mediaFiles);
          // this.persistCampaign$.next(this.campaignViewModel);
        } else {
          this.persistCampaign$.next(this.campaignViewModel);
        }

        setTimeout(() => {
          this.profileStore.loaderEnd();
        }, 1000);

        if (this.campaignViewModel.posts.length >= 1) {
          let socialAccountArtifacts = [];
          this.postsArrayToShow$.next(this.campaignViewModel.posts);
          this.campaignViewModel.posts.forEach(element => {
            // let post = new PostViewModel();
            // post = Object.assign({}, element);
            // here we filled already selected social accounts and remove if there  network
            // is no longer connected
            let socialAcountObj = {
              socialAccountObj: element.socialMediaAccounts,
              pageObj: element.socialMediaInfo
            };
            socialAccountArtifacts.push(socialAcountObj);
          });
          // this.campaignViewModel.posts = [];

          socialAccountArtifacts.forEach(element => {
            let socialAccount = this.socialAccountsStore.socialAccounts.find(
              x =>
                x.id == element.socialAccountObj.id &&
                element.socialAccountObj.status == "connected"
            );
            if (socialAccount) {
              // element = new PostViewModel();
              this.selectedSocialAccountsArtifactsArray.push(element);
              this.selectedSocialAccountsArtifactsArray$.next(
                this.selectedSocialAccountsArtifactsArray
              );
              // this.uniquSelectedSocialNetworks()
              this.selectedNetworks$.next(
                this.campaignContainerService.uniquSelectedSocialNetworks(
                  this.selectedSocialAccountsArtifactsArray
                )
              );
            }
          });
        }
      });
  }

  onChangeDescription(description: string) {
    this.campaignViewModel = this.campaignContainerService.onChangeDescription(
      description,
      this.campaignViewModel
    );
    this.postsArrayToShow$.next(this.campaignViewModel.posts);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 5000 });
  }

  onAddOrRemoveTags(image) {
    this.campaignViewModel = this.campaignContainerService.onAddOrRemoveTags(
      image,
      this.campaignViewModel
    );
  }

  onInputImageTagsEdit(image) {
    this.persistCampaign.mediaFiles.forEach(imageFile => {
      if (image.name == imageFile.originalFilename) {
        imageFile._tags = image.tags;
      }
    });
  }

  onUpdate = (campaign: CampaignViewModel) => {
    this.campaignContainerService.assignScheduleDate(campaign).subscribe(
      queDate => {
        this.campaignViewModel.scheduledAt = queDate;

        this.campaignViewModel.title = campaign.title;
        // this.campaignViewModel.scheduledAt = campaign.scheduledAt;
        this.campaignViewModel.state = campaign.state;
        this.campaignViewModel.ownerId = this.profileStore.userId;

        this.campaignViewModel.type = this.campaignContainerService.changeCampaignType(
          campaign
        );
        // this.campaignViewModel.mediaFiles = [...campaign.mediaFiles];
        this.profileStore.loaderStart();
        this.campaignContainerService
          .updateCampaign(this.campaignViewModel)
          .subscribe(
            updatedCampaign => {
              this.campaignService.getCamapign().subscribe(res => {
                // this.socket.emit("new create campaign", (createdCampaign.id));
                this.profileStore.loaderEnd();
                this.openDialog();
                // this.refreshAllVariables();
              });
            },
            err => {
              if ((err = "Server error")) {
                this.openSnackBar("server is not responding", "close");
              } else {
                this.openSnackBar(err.message, "close");
              }

              this.profileStore.loaderEnd();
            }
          );
      },
      err => {
        this.openSnackBar(err, "close");
      }
    );
  };

  onRemoveAccountsArtifact(socialAccountsArtifact: SocialAccountForCreate) {
    this.campaignNetworkService.removeSelectedSocialAccounts(
      socialAccountsArtifact,
      this.selectedSocialAccountsArtifactsArray
    );
    this.selectedSocialAccountsArtifactsArray$.next(
      this.selectedSocialAccountsArtifactsArray
    );
    let ifSameSocialNetworkExist = this.campaignContainerService
      .uniquSelectedSocialNetworks(this.selectedSocialAccountsArtifactsArray)
      .find(x => x == socialAccountsArtifact.socialAccountObj.type);
    if (!ifSameSocialNetworkExist) {
      this.campaignContainerService.removePostRelatedCroppedImages(
        socialAccountsArtifact,
        this.campaignViewModel.mediaFiles
      );
    }
    this.campaignContainerService.deletePostsToShow(
      socialAccountsArtifact,
      this.campaignViewModel
    );
    this.postsArrayToShow$.next(this.campaignViewModel.posts);

    // this.uniquSelectedSocialNetworks();
    this.selectedNetworks$.next(
      this.campaignContainerService.uniquSelectedSocialNetworks(
        this.selectedSocialAccountsArtifactsArray
      )
    );
  }

  getSocialnetwork = () => {
    if (this.socialAccountsStore.socialAccounts.length == 0) {
      this.socialAccountService.myAccounts().subscribe(res => {
        this.myAttachedSocialAccounts$.next(
          this.socialAccountsStore.socialAccounts
        );
        // this.ref.detectChanges();
      });
    }
  };

  openDialog = () => {
    this._router.navigateByUrl("campaign/campaign-list");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      heading:
        this.persistCampaign.state == "Posted" ||
        this.persistCampaign.state == "Canceled"
          ? "Campaign has been created successfully"
          : "Campaign has been updated successfully"
    };
    const dialogRef = this.dialog.open(GlobalDialogComponent, dialogConfig);
  };

  addSelectedSocialAccountArtifact(selectedArtifact) {
    let needToAdd = false;
    needToAdd = this.campaignNetworkService.onSelectSocialArtifact(
      selectedArtifact,
      this.selectedSocialAccountsArtifactsArray
    );
    if (needToAdd) {
      this.selectedSocialAccountsArtifactsArray.push(selectedArtifact);
      this.selectedSocialAccountsArtifactsArray$.next(
        this.selectedSocialAccountsArtifactsArray
      );
      this.makePostForViewModel(selectedArtifact);
      // this.uniquSelectedSocialNetworks();
      this.selectedNetworks$.next(
        this.campaignContainerService.uniquSelectedSocialNetworks(
          this.selectedSocialAccountsArtifactsArray
        )
      );
    }
  }

  onCropImage(base64CroppedImage) {
    const base64Data = base64CroppedImage.src;
    let newFile: MediaFileAssetViewModel = new MediaFileAssetViewModel();
    newFile.base64File = base64CroppedImage;
    newFile.name = base64CroppedImage.name;
    newFile.network = base64CroppedImage.type;
    let cFile: File;
    this.mediaAssetUtil.base64ToFile(base64CroppedImage).then(file => {
      newFile.file = file;

      this.campaignViewModel = this.campaignContainerService.fillCampaignAndPostWithCroppedImage(
        newFile,
        this.campaignViewModel
      );
      this.postsArrayToShow$.next(this.campaignViewModel.posts);
    });
  }

  makePostForViewModel(selectedArtifact) {
    this.campaignViewModel = this.campaignContainerService.makePostOnAddnewNetwork(
      selectedArtifact,
      this.campaignViewModel,
      this.selectedSocialAccountsArtifactsArray
    );
    this.selectedSocialAccountsArtifactsArray$.next(
      this.selectedSocialAccountsArtifactsArray
    );
    this.postsArrayToShow$.next(this.campaignViewModel.posts);
  }
  openCommnetsBar = () => {
    this.isCommentsShow = true;
    this.commentsType = "campaign";
    this.campaignService
      .getComments(this.editCampaignViewModel.id)
      .subscribe(res => {
        this.campaignComments$.next(this.campaignStore.campaignComments);
      });
  };
  sendMessage = () => {
    this.socket.emit("message", this.editCampaignViewModel.id);
  };

  getMessage = () => {
    this.socket.on("message", data => {
      if (data && data.id === this.editCampaignViewModel.id) {
        this.campaignStore.addCampaignCommnets(data);
        this.campaignComments$.next(this.campaignStore.campaignComments);
      }
    });
  };

  closeCommnetsBar() {
    this.isCommentsShow = false;
    this.close();
  }
  close() {
    this.socket.disconnect();
    console.log("scoket connection disconnected");
  }
  onRemoveMediaFile(incomingFile: MediaFileAssetViewModel) {
    // console.log("posts", this.campaignViewModel.posts);
    this.campaignViewModel = this.campaignContainerService.removeMediaFileFromCampaignViewModel(
      incomingFile,
      this.campaignViewModel
    );
    let postsWithFile = this.campaignViewModel.posts.filter(x =>
      x.mediaFiles.find(
        x =>
          x.name == incomingFile.name ||
          x.originalFilename == incomingFile.originalFilename ||
          x.name == incomingFile.originalFilename
      )
    );
    let duplicateFound = false;
    let indexesOfPosts = [];
    postsWithFile.forEach(post => {
      let ifDuplicate = this.campaignViewModel.posts.filter(
        x =>
          x.socialMediaAccountId == post.socialMediaAccountId &&
          x.socialMediaInfo.id == post.socialMediaInfo.id
      );
      if (ifDuplicate.length > 1) {
        duplicateFound = true;
      }
      if (
        duplicateFound &&
        post.mediaFiles.length == 1 &&
        ((incomingFile.type == "video/mp4" && post.type == "video") ||
          (incomingFile.type != "video/mp4" && post.type == "image"))
      ) {
        this.campaignViewModel.posts = this.campaignContainerService.deletePostContainThisFile(
          post,
          incomingFile,
          this.campaignViewModel
        );
        this.postsArrayToShow$.next(this.campaignViewModel.posts);
        this.selectedSocialAccountsArtifactsArray = this.campaignContainerService.removeOneSelectedArtifactRelatedToPost(
          post,
          this.selectedSocialAccountsArtifactsArray
        );
        this.selectedSocialAccountsArtifactsArray$.next(
          this.selectedSocialAccountsArtifactsArray
        );
      } else if (
        (incomingFile.type == "video/mp4" &&
          (post.type == "video" || post.type == "multiple-videos")) ||
        (incomingFile.type != "video/mp4" &&
          (post.type == "image" || post.type == "multiple-images"))
      ) {
        if (
          (ifDuplicate.length == 1 && post.mediaFiles.length >= 1) ||
          (ifDuplicate.length > 1 && post.mediaFiles.length > 1)
        ) {
          this.campaignViewModel = this.campaignContainerService.removeMediaFileFromPost(
            incomingFile,
            this.campaignViewModel
          );
          this.postsArrayToShow$.next(this.campaignViewModel.posts);
        }
      }
    });

    // this.campaignViewModel = this.campaignContainerService.onRemovemediaFile(incomingFile, this.campaignViewModel);
    // this.postsArrayToShow$.next(this.campaignViewModel.posts);
  }
  onAddMediaFile(newFile: MediaFileAssetViewModel) {
    this.campaignContainerService.addMediaFileInCampaign(
      newFile,
      this.campaignViewModel
    );
    if (this.campaignViewModel.posts.length > 0) {
      let relativePost = false;
      this.campaignViewModel.posts.forEach(post => {
        if (
          ((post.type == "image" || post.type == "multiple-images") &&
            newFile.type != "video/mp4") ||
          ((post.type == "video" || post.type == "multiple-videos") &&
            newFile.type == "video/mp4") ||
          post.type == "text"
        ) {
          post = this.campaignContainerService.addMediaFileInToRelativePost(
            newFile,
            post
          );
          relativePost = true;
          this.postsArrayToShow$.next(this.campaignViewModel.posts);
        }
      });

      this.postsArrayToShow$.next(this.campaignViewModel.posts);

      if (!relativePost) {
        this.selectedSocialAccountsArtifactsArray.forEach(network => {
          this.campaignContainerService.makePostForViewModelOnAddNewTypeFile(
            newFile,
            network,
            this.campaignViewModel
          );
          this.selectedSocialAccountsArtifactsArray.push(network);
          this.selectedSocialAccountsArtifactsArray$.next(
            this.selectedSocialAccountsArtifactsArray
          );
          this.postsArrayToShow$.next(this.campaignViewModel.posts);
        });
      }
    }
  }
  addThumbnailInNewFile(thumbnail: any) {
    let file = this.campaignViewModel.mediaFiles.find(
      x => x.name == thumbnail.file.name
    );
    if (file) {
      file.thumbnailFile = thumbnail;
    }
  }
}
