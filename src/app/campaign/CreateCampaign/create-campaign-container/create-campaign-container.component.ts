import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { CampaignService } from "../../shared/service/campaign.service";
import { BehaviorSubject } from "rxjs";
import { UserProfile } from "../../../store/user-profile";
import { SocialAccountsStore } from "../../../store/social-accounts-store";
import { MyNetworkService } from "../../../membership/service/my-network.service";
import { MatSnackBar } from "@angular/material";
import { MatDialogConfig, MatDialog } from "@angular/material";
import * as _ from "lodash";
import { SocialAccountForCreate } from "../../shared/components/my-attached-social-networks/model/social-account-for-create.model";
import { GlobalDialogComponent } from "../../../shared/global-dialog/global-dialog.component";
import {
  Post,
  Campaign,
  SocialMediaAccount
} from "./../../../shared/sdk/models";
import { ActivatedRoute } from "@angular/router";
import { UUID } from "angular2-uuid";
import { CampaignSocialAccountsService } from "../../shared/service/campaign-social-accounts.service";
import { Socket } from "ng-socket-io";
import { CampaignViewModel } from "../../shared/models/campaignViewModel";
import { CampaignContainerService } from "./../../shared/service/campaign-container.service";
import { PostViewModel } from "../../shared/models/postViewModel";
import { MediaFileAssetViewModel } from "../../shared/models/mediaFileAssetViewModel";
import { MediaAssetConversionUtil } from "./../../../shared/mediaAssetUtil/mediaAssetConversionUtil";
import * as moment from "moment-timezone";
import { relative } from "path";
import { CampaignDefinitionViewModel } from "../../shared/components/campaign-definition/model/campaignDefinitionViewModel";
let errors = require("../message.json");
@Component({
  selector: "create-campaign-container",
  templateUrl: "./create-campaign-container.component.html",
  styleUrls: ["./create-campaign-container.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateCampaignContainerComponent implements OnInit {
  imagePath: string = "";
  selectedSocialAccountsArtifactsArray: Array<SocialAccountForCreate> = [];
  isCommentsShow: boolean;

  campaignViewModel: CampaignViewModel;

  selectedNetworks$: BehaviorSubject<Array<string>>;
  selectedSocialAccountsArtifactsArray$: BehaviorSubject<
    Array<SocialAccountForCreate>
  >;
  postsArrayToShow$: BehaviorSubject<Array<PostViewModel>>;
  inputCampaign$: BehaviorSubject<CampaignViewModel>;
  myAttachedSocialAccounts$: BehaviorSubject<Array<SocialMediaAccount>>;

  constructor(
    public campaignContainerService: CampaignContainerService,
    public campaignNetworkService: CampaignSocialAccountsService,
    private router: ActivatedRoute,
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    public campaignService: CampaignService,
    public profileStore: UserProfile,
    public socialAccountsStore: SocialAccountsStore,
    public socialAccountService: MyNetworkService,
    public socket: Socket,
    private _Activatedroute: ActivatedRoute,
    public mediaAssetUtil: MediaAssetConversionUtil
  ) {
    this.campaignViewModel = new CampaignViewModel();
    this.postsArrayToShow$ = new BehaviorSubject(this.campaignViewModel.posts);
    this.inputCampaign$ = new BehaviorSubject(this.campaignViewModel);
    this.selectedSocialAccountsArtifactsArray$ = new BehaviorSubject(
      this.selectedSocialAccountsArtifactsArray
    );
    this.selectedNetworks$ = new BehaviorSubject([""]);
    this.myAttachedSocialAccounts$ = new BehaviorSubject(
      this.socialAccountsStore.socialAccounts
    );
  }

  calcTime(offset) {
    // create Date object for current location
    var d = new Date();
    console.log("current local time", d);
    // convert to msec
    // add local time zone offset
    // get UTC time in msec
    var utc = d.getTime() + d.getTimezoneOffset() * 60000;

    // create new Date object for different city
    // using supplied offset
    var nd = new Date(utc + 3600000 * offset);

    // return time as a string
    return nd;
  }

  ngOnInit() {
    let date = this.calcTime("-0800");
    console.log("date conversion", date);

    this.imagePath = require("./../../../shared/config/urls.json").IMAGE_DOWNLOAD_END_POINT_URL;
    this.getMySocialAccounts();
    if (this._Activatedroute.snapshot.queryParams["id"]) {
      this.profileStore.loaderStart();
      this.campaignService
        .getCampaignForEdit(this._Activatedroute.snapshot.queryParams["id"])
        .subscribe((res: Campaign) => {
          this.campaignViewModel.populateFromServerModel(res);

          if (this.campaignViewModel.mediaFiles.length > 0) {
            this.convertPersistFilesIntoNewFiles();
          } else {
            this.inputCampaign$.next(this.campaignViewModel);

            this.profileStore.loaderEnd();
            if (this.campaignViewModel.posts.length > 0) {
              this.postsArrayToShow$.next(this.campaignViewModel.posts);
            }
          }
        });
    } else {
      this.initializeCampaign();
    }

    this.selectedNetworks$ = new BehaviorSubject([]);

    this.isCommentsShow = false;
  }
  initializeCampaign() {
    this.campaignViewModel = new CampaignViewModel();
    this.campaignViewModel.scheduledAt = this.router.snapshot.queryParams[
      "scheduledAt"
    ]
      ? this.router.snapshot.queryParams["scheduledAt"]
      : new Date();
    this.inputCampaign$.next(this.campaignViewModel);
    this.postsArrayToShow$.next(this.campaignViewModel.posts);
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }

  async convertPersistFilesIntoNewFiles() {
    let convertMediaAssetTobase64AndFiles: Array<MediaFileAssetViewModel> = [];

    this.campaignViewModel.mediaFiles.forEach(x => {
      convertMediaAssetTobase64AndFiles.push(x);

      if (x.croppedImages && x.croppedImages.length > 0) {
        x.croppedImages.forEach(y => {
          convertMediaAssetTobase64AndFiles.push(y);
        });
      }
    });

    let files = await this.campaignContainerService.fileRead(
      true,
      true,
      convertMediaAssetTobase64AndFiles
    );

    if (files) {
      let filesWiththumbnail = await this.campaignContainerService.convertToThumbnailbase64AndFile(
        this.campaignViewModel.mediaFiles
      );
      this.campaignContainerService.removeThumbnailsFromMediaFilesViewModel(
        this.campaignViewModel.mediaFiles
      );
      this.campaignContainerService.removeIdFromMediaFilesViewModel(
        convertMediaAssetTobase64AndFiles
      );

      this.inputCampaign$.next(this.campaignViewModel);

      let artifactsToCreatePosts: Array<SocialAccountForCreate> = [
        ...this.getPersistSelectedArtifacts()
      ];
      this.campaignViewModel.posts = [];
      this.createPostsWithPersistSocialArtifacts(artifactsToCreatePosts);

      // this.postsArrayToShow$.next(this.campaignViewModel.posts);
    }
  }

  createPostsWithPersistSocialArtifacts(
    artifactsArrayToCreateNewPosts: Array<SocialAccountForCreate>
  ) {
    artifactsArrayToCreateNewPosts.forEach(element => {
      let socialAccount = this.socialAccountsStore.socialAccounts.find(
        x =>
          x.id == element.socialAccountObj.id &&
          element.socialAccountObj.status == "connected"
      );
      if (socialAccount) {
        // element = new PostViewModel();
        this.addSelectedSocialAccountArtifact(element);
      }
    });
  }

  getPersistSelectedArtifacts(): Array<SocialAccountForCreate> {
    if (this.campaignViewModel.posts.length >= 1) {
      let socialAccountArtifacts: Array<SocialAccountForCreate> = [];
      // this.postsArrayToShow$.next(this.campaignViewModel.posts);
      this.campaignViewModel.posts.forEach(element => {
        let socialAcountObj: SocialAccountForCreate = {
          socialAccountObj: element.socialMediaAccounts,
          pageObj: element.socialMediaInfo
        };
        socialAccountArtifacts.push(socialAcountObj);
      });

      return socialAccountArtifacts;
    }
  }

  refreshAllVariables() {
    this.selectedSocialAccountsArtifactsArray = [];
    this.selectedSocialAccountsArtifactsArray$.next(
      this.selectedSocialAccountsArtifactsArray
    );
    this.isCommentsShow = false;
    this.initializeCampaign();
  }
  getMySocialAccounts() {
    if (this.socialAccountsStore.socialAccounts.length == 0) {
      this.socialAccountService.myAccounts().subscribe(res => {
        this.myAttachedSocialAccounts$.next(
          this.socialAccountsStore.socialAccounts
        );
      });
    }
  }

  onChangeDescription(description: string) {
    this.campaignViewModel = this.campaignContainerService.onChangeDescription(
      description,
      this.campaignViewModel
    );
    this.postsArrayToShow$.next(this.campaignViewModel.posts);
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
  onAddOrRemoveTags(image) {
    // this.campaignViewModel = this.campaignContainerService.onAddOrRemoveTags(image, this.campaignViewModel);
    // this.postsArrayToShow$.next(this.campaignViewModel.posts);
    // console.log(this.campaignViewModel)
  }
  onRemoveAccountsArtifact(socialAccountsArtifact: SocialAccountForCreate) {
    this.selectedSocialAccountsArtifactsArray = this.campaignNetworkService.removeSelectedSocialAccounts(
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
  // removePostRelatedCroppedImages(socialAccountsPage: SocialAccountForCreate, campaignMediaFiles:Array<MediaFileAssetViewModel>) {
  //   let ifSameSocialNetworkExist = this.campaignContainerService.uniquSelectedSocialNetworks(this.selectedSocialAccountsArtifactsArray)
  //   .find(x => x == socialAccountsPage.socialAccountObj.type);
  //   if (!ifSameSocialNetworkExist) {
  //     campaignMediaFiles.forEach(x => {
  //       let imageFound = x.croppedImages.findIndex(x => x.network == socialAccountsPage.socialAccountObj.type);
  //       if (imageFound > -1) {
  //         x.croppedImages.splice(imageFound, 1);
  //       }
  //     })
  //   }
  //   return campaignMediaFiles
  // }

  addSelectedSocialAccountArtifact(selectedArtifact: SocialAccountForCreate) {
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
      this.makePostForViewModelOnAddNewNetwork(selectedArtifact);
      // this.uniquSelectedSocialNetworks();
      this.selectedNetworks$.next(
        this.campaignContainerService.uniquSelectedSocialNetworks(
          this.selectedSocialAccountsArtifactsArray
        )
      );
    }
  }
  // uniquSelectedSocialNetworks() {
  // this.selectedNetworks$.next(this.campaignContainerService.uniquSelectedSocialNetworks(this.selectedSocialAccountsArtifactsArray));
  // var selectedNetworks = [];
  // let found = -1;
  // this.selectedSocialAccountsArtifactsArray.forEach(account => {
  //   selectedNetworks.push(account.socialAccountObj.type);
  // });
  // function onlyUnique(value, index, self) {
  //   return self.indexOf(value) === index;
  // }
  // var uniqueSelectedNetworks = selectedNetworks.filter(onlyUnique);
  // this.selectedNetworks$.next(uniqueSelectedNetworks);
  // return uniqueSelectedNetworks;
  // }

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
    // let duplicateFound = false;
    let indexesOfPosts = [];
    postsWithFile.forEach(post => {
      let ifDuplicate = this.campaignViewModel.posts.filter(
        x =>
          x.socialMediaAccountId == post.socialMediaAccountId &&
          x.socialMediaInfo.id == post.socialMediaInfo.id
      );
      // if (ifDuplicate.length > 1) {
      //   duplicateFound = true;
      // }
      if (
        ifDuplicate.length > 1 &&
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
  }

  onCreate(campaign: CampaignViewModel) {
    this.campaignContainerService.assignScheduleDate(campaign).subscribe(
      res => {
        this.campaignViewModel.scheduledAt = res;
        this.campaignViewModel.title = campaign.title;
        this.campaignViewModel.state = campaign.state;
        this.campaignViewModel.ownerId = this.profileStore.userId;
        this.campaignViewModel.type = this.campaignContainerService.changeCampaignType(
          campaign
        );
        this.campaignViewModel.mediaFiles = [...campaign.mediaFiles];
        this.profileStore.loaderStart();
        this.campaignContainerService
          .createCampaign(this.campaignViewModel)
          .subscribe(
            createdCampaign => {
              this.campaignService.getCamapign().subscribe(res => {
                this.profileStore.loaderEnd();
                this.openDialog();
                this.refreshAllVariables();
              });
            },
            err => {
              this.openSnackBar(err.error.message, "close");
            }
          );
      },
      err => {
        this.openSnackBar(err, "close");
      }
    );
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      heading: errors.errors.createCampaignSuccess
    };
    const dialogRef = this.dialog.open(GlobalDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      // this.route.navigateByUrl("/campaign/campaign-list")
    });
  }

  async makePostForViewModelOnAddNewNetwork(selectedArtifact) {
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
}
