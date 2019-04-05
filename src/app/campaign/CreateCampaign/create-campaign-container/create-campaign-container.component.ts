
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
import { Post, Campaign, SocialMediaAccount } from "./../../../shared/sdk/models";
import { ActivatedRoute } from "@angular/router";
import { UUID } from "angular2-uuid";
import { CampaignSocialAccountsService } from "../../shared/service/campaign-social-accounts.service";
import { Socket } from "ng-socket-io";
import { CampaignViewModel } from "../../shared/models/campaignViewModel";
import { CampaignContainerService } from "./../../shared/service/campaign-container.service";
import { PostViewModel } from "../../shared/models/postViewModel";
import { MediaFileAssetViewModel } from "../../shared/models/mediaFileAssetViewModel";
import { MediaAssetConversionUtil } from "./../../../shared/mediaAssetUtil/mediaAssetConversionUtil";
import { CampaignStatusStore } from "./../../../store/campaign-status-store";
import { CamapignStatusService } from "./../../custom-campaign-status/service/camapign-status.service";
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
  selectedSocialAccountsArtifactsArray$: BehaviorSubject<Array<SocialAccountForCreate>>;
  postsArrayToShow$: BehaviorSubject<Array<PostViewModel>>;
  inputCampaign$: BehaviorSubject<CampaignViewModel>;
  myAttachedSocialAccounts$: BehaviorSubject<Array<SocialMediaAccount>>;

  constructor(
    public campaignStatusStore: CampaignStatusStore,
    public campaignContainerService: CampaignContainerService,
    public campaignNetworkService: CampaignSocialAccountsService,
    private router: ActivatedRoute,
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    public campaignService: CampaignService,
    public profileStore: UserProfile,
    public camapignStatusService: CamapignStatusService,
    public socialAccountsStore: SocialAccountsStore,
    public socialAccountService: MyNetworkService,
    public socket: Socket,
    private _Activatedroute: ActivatedRoute,
    public mediaAssetUtil: MediaAssetConversionUtil
  ) {
    this.campaignViewModel = new CampaignViewModel();
    this.postsArrayToShow$ = new BehaviorSubject(this.campaignViewModel.posts);
    this.inputCampaign$ = new BehaviorSubject(this.campaignViewModel)
    this.selectedSocialAccountsArtifactsArray$ = new BehaviorSubject(this.selectedSocialAccountsArtifactsArray);
    this.selectedNetworks$ = new BehaviorSubject(['']);
    this.myAttachedSocialAccounts$ = new BehaviorSubject(this.socialAccountsStore.socialAccounts);
  }



  calcTime(offset) {

    // create Date object for current location
    var d = new Date();
    console.log("current local time", d)
    // convert to msec
    // add local time zone offset
    // get UTC time in msec
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    var nd = new Date(utc + (3600000 * offset));

    // return time as a string
    return nd;
  }

  ngOnInit() {
    let date = this.calcTime("-0800");
    console.log("date conversion", date)

    this.imagePath = require("./../../../shared/config/urls.json").IMAGE_DOWNLOAD_END_POINT_URL;
    this.getMySocialAccounts();
    if (this._Activatedroute.snapshot.queryParams["id"]) {
      this.profileStore.loaderStart();
      this.campaignService.getCampaignForEdit(this._Activatedroute.snapshot.queryParams["id"])
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

    this.getCustomStatus();
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

    let files = await this.campaignContainerService.fileRead(true, true, convertMediaAssetTobase64AndFiles);

    if (files) {
      let filesWiththumbnail = await this.campaignContainerService.convertToThumbnailbase64AndFile(this.campaignViewModel.mediaFiles);
      this.campaignContainerService.removeThumbnailsFromMediaFilesViewModel(this.campaignViewModel.mediaFiles);
      this.campaignContainerService.removeIdFromMediaFilesViewModel(convertMediaAssetTobase64AndFiles);

      this.inputCampaign$.next(this.campaignViewModel);

      let artifactsToCreatePosts: Array<SocialAccountForCreate> = [...this.getPersistSelectedArtifacts()];
      this.campaignViewModel.posts = [];
      this.createPostsWithPersistSocialArtifacts(artifactsToCreatePosts);

      // this.postsArrayToShow$.next(this.campaignViewModel.posts);
    }
  }

  createPostsWithPersistSocialArtifacts(artifactsArrayToCreateNewPosts: Array<SocialAccountForCreate>) {
    artifactsArrayToCreateNewPosts.forEach(element => {
      let socialAccount = this.socialAccountsStore.socialAccounts.find(x => x.id == element.socialAccountObj.id &&
        element.socialAccountObj.status == "connected");
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

  getCustomStatus() {
    if (this.campaignStatusStore.customStatuses.length == 0) {
      this.camapignStatusService.getCustomStatus().subscribe(response => { });
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
    this.selectedSocialAccountsArtifactsArray = this.campaignNetworkService.removeSelectedSocialAccounts(socialAccountsArtifact, this.selectedSocialAccountsArtifactsArray);
    this.selectedSocialAccountsArtifactsArray$.next(this.selectedSocialAccountsArtifactsArray);
    let ifSameSocialNetworkExist = this.campaignContainerService.uniquSelectedSocialNetworks(this.selectedSocialAccountsArtifactsArray)
      .find(x => x == socialAccountsArtifact.socialAccountObj.type);
    if (!ifSameSocialNetworkExist) {
      this.campaignContainerService.removePostRelatedCroppedImages(socialAccountsArtifact, this.campaignViewModel.mediaFiles);
    }
    this.campaignContainerService.deletePostsToShow(socialAccountsArtifact, this.campaignViewModel);
    this.postsArrayToShow$.next(this.campaignViewModel.posts);
    // this.uniquSelectedSocialNetworks();
    this.selectedNetworks$.next(this.campaignContainerService.uniquSelectedSocialNetworks(this.selectedSocialAccountsArtifactsArray));

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
      this.selectedNetworks$.next(this.campaignContainerService.uniquSelectedSocialNetworks(this.selectedSocialAccountsArtifactsArray));

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
    this.campaignViewModel = this.campaignContainerService.removeMediaFileFromCampaignViewModel(incomingFile, this.campaignViewModel);
    let postsWithFile = this.campaignViewModel.posts.filter(x => x.mediaFiles.find(x => (x.name == incomingFile.name) ||
      (x.originalFilename == incomingFile.originalFilename) || (x.name == incomingFile.originalFilename)));
    // let duplicateFound = false;
    let indexesOfPosts = [];
    postsWithFile.forEach(post => {
      let ifDuplicate = this.campaignViewModel.posts.filter(x => x.socialMediaAccountId == post.socialMediaAccountId && x.socialMediaInfo.id == post.socialMediaInfo.id);
      // if (ifDuplicate.length > 1) {
      //   duplicateFound = true;
      // }
      if (ifDuplicate.length > 1 && post.mediaFiles.length == 1 &&
        ((incomingFile.type == 'video/mp4' && post.type == 'video') ||
          (incomingFile.type != 'video/mp4' && post.type == 'image'))) {
        this.campaignViewModel.posts = this.campaignContainerService.deletePostContainThisFile(post, incomingFile, this.campaignViewModel);
        this.postsArrayToShow$.next(this.campaignViewModel.posts);
        this.selectedSocialAccountsArtifactsArray = this.campaignContainerService.removeOneSelectedArtifactRelatedToPost(post, this.selectedSocialAccountsArtifactsArray);
        this.selectedSocialAccountsArtifactsArray$.next(this.selectedSocialAccountsArtifactsArray);
      }
      else if ((incomingFile.type == 'video/mp4' && (post.type == 'video' || post.type == 'multiple-videos')) ||
        (incomingFile.type != 'video/mp4' && (post.type == 'image' || post.type == 'multiple-images'))) {
        if ((ifDuplicate.length == 1 && post.mediaFiles.length >= 1) || (ifDuplicate.length > 1 && post.mediaFiles.length > 1)) {
          this.campaignViewModel = this.campaignContainerService.removeMediaFileFromPost(incomingFile, this.campaignViewModel);
          this.postsArrayToShow$.next(this.campaignViewModel.posts);
        }

      }
    })

  }

  onCreate(campaign: CampaignViewModel) {
    this.campaignContainerService.assignScheduleDate(campaign).subscribe(
      res => {
        this.campaignViewModel.scheduledAt = res;
        this.campaignViewModel.title = campaign.title;
        this.campaignViewModel.state = campaign.state;
        this.campaignViewModel.campaignStatuses = campaign.campaignStatuses;
        this.campaignViewModel.ownerId = this.profileStore.userId;
        this.campaignViewModel.type = this.campaignContainerService.changeCampaignType(campaign);
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
    // if (dateAssigned) {

    // }
    // else {
    //   this.openSnackBar('Your weekly queue is full, add another slot or wait for slot to be available', 'close')
    // }
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

  //  makePostForViewModelOnAddNewTypeFile(newFile: MediaFileAssetViewModel, selectedArtifact:SocialAccountForCreate) {

  //   let postViewObj: PostViewModel = new PostViewModel();
  //   postViewObj.description = this.campaignViewModel.description;
  //   postViewObj.socialMediaAccountId = selectedArtifact.socialAccountObj.id;
  //   postViewObj.network = selectedArtifact.socialAccountObj.type;
  //   postViewObj.ownerId = selectedArtifact.socialAccountObj.registerUserId;
  //   postViewObj.error = "";
  //   postViewObj.type = (newFile.type == 'video/mp4' ? 'video' : newFile.type != 'video/mp4' ? 'image' : 'error on making image relative post');
  //   postViewObj.socialMediaInfo = Object.assign({}, selectedArtifact.pageObj);

  //   let file: MediaFileAssetViewModel = new MediaFileAssetViewModel();
  //   file.base64File = Object.assign({}, newFile.base64File);
  //   file.file = Object.assign({}, newFile.file);
  //   file.name = newFile.name;
  //   file.isCropped = false;
  //   file.type = newFile.type;
  //   postViewObj.mediaFiles.push(file);

  //   this.campaignViewModel.posts.push(postViewObj);
  //   this.postsArrayToShow$.next(this.campaignViewModel.posts);



  // }



  async makePostForViewModelOnAddNewNetwork(selectedArtifact) {

    this.campaignViewModel = this.campaignContainerService.makePostOnAddnewNetwork(selectedArtifact, this.campaignViewModel, this.selectedSocialAccountsArtifactsArray);
    this.selectedSocialAccountsArtifactsArray$.next(this.selectedSocialAccountsArtifactsArray);
    this.postsArrayToShow$.next(this.campaignViewModel.posts);
    // let ifImageExist = this.campaignViewModel.mediaFiles.some(x => x.type != 'video/mp4');
    // let ifVideoExist = this.campaignViewModel.mediaFiles.some(x => x.type == 'video/mp4');
    // let ifMultipleImages = this.campaignViewModel.mediaFiles.filter(x => x.type != 'video/mp4');
    // let ifMultipleVideos = this.campaignViewModel.mediaFiles.filter(x => x.type == 'video/mp4');
    // // postViewObj.scheduleAt = this.campaignViewModel.scheduledAt;
    // let noOfPosts = [];
    // if (ifImageExist) {
    //   noOfPosts.push('image');
    // }
    // if (ifVideoExist) {
    //   noOfPosts.push('video');
    // }
    // if (noOfPosts.length == 0) {
    //   noOfPosts.push('text');
    // }
    // noOfPosts.forEach(postType => {
    //   let postViewObj: PostViewModel = new PostViewModel();
    //   postViewObj.description = this.campaignViewModel.description;
    //   postViewObj.socialMediaAccountId = selectedArtifact.socialAccountObj.id;
    //   postViewObj.network = selectedArtifact.socialAccountObj.type;
    //   postViewObj.ownerId = this.profileStore.userId;
    //   postViewObj.error = "";
    //   postViewObj.type = (postType == 'text' ? 'text' : postType == 'image' && ifMultipleImages.length > 1 ? 'multiple-images':
    //   postType == 'video' && ifMultipleVideos.length > 1 ? 'multiple-videos':'error');
    //   postViewObj.socialMediaInfo = Object.assign({}, selectedArtifact.pageObj);
    //   //postViewObj.mediaFiles=this.campaignViewModel.mediaFiles;
    //   let isCropedImageExist: boolean = false;
    //   if (this.campaignViewModel.mediaFiles.length >= 1) {
    //     this.campaignViewModel.mediaFiles.forEach(x => {
    //       isCropedImageExist = false;

    //       if (x.croppedImages.length >= 1 && postType == 'image') {
    //         var cropedImage = x.croppedImages.find(
    //           x => x.network == postViewObj.network || x.network == "All"
    //         );
    //         if (cropedImage) {
    //           postViewObj.mediaFiles.push(Object.assign({}, cropedImage));
    //           isCropedImageExist = true;
    //         }
    //       }

    //       if (!isCropedImageExist) {
    //         let file: MediaFileAssetViewModel = new MediaFileAssetViewModel();
    //         file.base64File = Object.assign({}, x.base64File);
    //         file.croppedImages = Object.assign([], x.croppedImages);
    //         file.file = Object.assign({}, x.file);
    //         file.name = x.name;
    //         if(x.id && x.id!=''){
    //           file.originalFilename = x.originalFilename;
    //           file.thumbnailName = x.thumbnailName;
    //           file.id = x.id;
    //         }
    //         file.tags = Object.assign([], x.tags);
    //         file.isCropped = false;
    //         file.type = x.type;
    //         if (x.type == 'video/mp4' && postType == 'video') {
    //           postViewObj.mediaFiles.push(
    //             Object.assign({ croppedImages: [] }, file)
    //           );
    //         } else if (x.type != 'video/mp4' && postType != 'video') {
    //           postViewObj.mediaFiles.push(
    //             Object.assign({ croppedImages: [] }, file)
    //           );
    //         }

    //       }
    //     });
    //   }

    //   this.campaignViewModel.posts.push(postViewObj);
    //   this.postsArrayToShow$.next(this.campaignViewModel.posts);
    // })


  }

  onAddMediaFile(newFile: MediaFileAssetViewModel) {
    this.campaignContainerService.addMediaFileInCampaign(newFile, this.campaignViewModel);
    if (this.campaignViewModel.posts.length > 0) {
      let relativePost = false;
      this.campaignViewModel.posts.forEach(post => {
        if (((post.type == 'image' || post.type == 'multiple-images') && newFile.type != 'video/mp4')
          || ((post.type == 'video' || post.type == 'multiple-videos') && newFile.type == 'video/mp4')
          || post.type == 'text') {
          post = this.campaignContainerService.addMediaFileInToRelativePost(newFile, post);
          relativePost = true;
          this.postsArrayToShow$.next(this.campaignViewModel.posts);
        }
      })

      this.postsArrayToShow$.next(this.campaignViewModel.posts);

      if (!relativePost) {
        this.selectedSocialAccountsArtifactsArray.forEach(network => {
          this.campaignContainerService.makePostForViewModelOnAddNewTypeFile(newFile, network, this.campaignViewModel);
          this.selectedSocialAccountsArtifactsArray.push(network);
          this.selectedSocialAccountsArtifactsArray$.next(this.selectedSocialAccountsArtifactsArray);
          this.postsArrayToShow$.next(this.campaignViewModel.posts);
        })
      }
      // let networks = this.uniquSelectedSocialNetworks();
      // networks.forEach(network => {
      //   let relativePost = this.campaignViewModel.posts.filter(x => ((x.type == 'image' || x.type == 'multiple-images') && newFile.type != 'video/mp4' && x.network==network)
      //     || ((x.type == 'video' || x.type == 'multiple-videos') && newFile.type == 'video/mp4' && x.network==network)
      //     || x.type == 'text' && x.network==network);

      //   if (relativePost && relativePost.length > 0) {
      //     relativePost.forEach(post => {
      //       this.campaignContainerService.addMediaFileToRelativePost(newFile, post);
      //       this.postsArrayToShow$.next(this.campaignViewModel.posts);
      //     })

      //   }
      //   if (!relativePost || relativePost.length == 0) {
      //     this.makePostForViewModelOnAddNewTypeFile(newFile, network);
      //     this.postsArrayToShow$.next(this.campaignViewModel.posts);
      //   }
      // });

    }
    // this.campaignContainerService.addMediaFileInCampaign(newFile,this.campaignViewModel);
    // this.campaignViewModel = this.campaignContainerService.onAddMediaFile(newFile, this.campaignViewModel);

    // this.postsArrayToShow$.next(this.campaignViewModel.posts);
  }

  // deletePostsToShow(socialAccountsArtifact: SocialAccountForCreate) {
  //   // let postsToDelete = [];
  //   let loopLength = this.campaignViewModel.posts.length;
  //   for (let i = 0; i < loopLength; i++) {
  //     let findIndex = this.campaignViewModel.posts.findIndex(x =>
  //       x.socialMediaAccountId == socialAccountsArtifact.socialAccountObj.id &&
  //       x.socialMediaInfo.id == socialAccountsArtifact.pageObj.id
  //     );

  //     // this.campaignViewModel.posts.forEach((post, index) => {
  //     if (findIndex > -1) {
  //       if (this.campaignViewModel.posts[findIndex].id && this.campaignViewModel.posts[findIndex].id != '') {
  //         this.campaignViewModel.postsToDelete.push(this.campaignViewModel.posts[findIndex]);
  //         // this.deleteCroppedImagesfromDeletedPost(this.campaignViewModel.posts[findIndex].mediaFiles);
  //       }
  //       this.campaignViewModel.posts.splice(findIndex, 1);
  //       this.postsArrayToShow$.next(this.campaignViewModel.posts);
  //     }
  //   }
  // })

  // postsToDelete.forEach(index => {
  //   this.campaignViewModel.posts.splice(index, 1);

  // })
  // this.postsArrayToShow$.next(this.campaignViewModel.posts);

  // let findIndex = this.campaignViewModel.posts.findIndex(
  //   x =>
  //     x.socialMediaAccountId == socialAccountsArtifact.socialAccountObj.id &&
  //     x.socialMediaInfo.id == socialAccountsArtifact.pageObj.id
  // );

  // if (findIndex > -1) {
  //   this.campaignViewModel.posts.splice(findIndex, 1);
  //   this.postsArrayToShow$.next(this.campaignViewModel.posts);
  // }
  // }

  // fillCampaignAndPostWithCroppedImage(incomingCroppedfile: MediaFileAssetViewModel) {
  //   this.campaignViewModel.mediaFiles.forEach((file, index) => {
  //     if (incomingCroppedfile.name == file.name) {
  //       if (file.croppedImages.length >= 1) {
  //         let find = file.croppedImages.findIndex(x => x.name == incomingCroppedfile.name && (x.network == incomingCroppedfile.network || incomingCroppedfile.network == 'All'))
  //         if (find > -1) {
  //           file.croppedImages[find].file = incomingCroppedfile.file;
  //           file.croppedImages[find].base64File = incomingCroppedfile.base64File;
  //           file.croppedImages[find].name = incomingCroppedfile.name;
  //           file.isCropped = true;
  //           file.croppedImages[find].isCropped = true;
  //           file.croppedImages[find].tags = incomingCroppedfile.tags;
  //           file.croppedImages[find].network = incomingCroppedfile.network;
  //         }
  //       }
  //       else {
  //         let newCroppedFile: MediaFileAssetViewModel = new MediaFileAssetViewModel();
  //         newCroppedFile.base64File = incomingCroppedfile.base64File;
  //         newCroppedFile.file = incomingCroppedfile.file;
  //         newCroppedFile.name = incomingCroppedfile.name;
  //         newCroppedFile.network = incomingCroppedfile.base64File.type;
  //         newCroppedFile.isCropped = true;
  //         newCroppedFile.network = incomingCroppedfile.network;

  //         file.croppedImages.push(newCroppedFile);
  //       }

  //     }
  //   });

  //   this.campaignViewModel.posts.forEach((post, index) => {
  //     post.mediaFiles.forEach((file, index) => {
  //       if (file.name == incomingCroppedfile.name && (incomingCroppedfile.network == post.network || incomingCroppedfile.network == 'All')) {
  //         file.base64File = incomingCroppedfile.base64File;
  //         file.file = incomingCroppedfile.file;
  //         file.isCropped = true;
  //         file.network = post.network;
  //         this.postsArrayToShow$.next(this.campaignViewModel.posts);
  //       }
  //     })
  //   })
  // }

  // saveCroppedImagestoUpload(base64CroppedImage) {
  //   const base64Data = base64CroppedImage.src;
  //   let newFile: MediaFileAssetViewModel = new MediaFileAssetViewModel();
  //   newFile.base64File = base64CroppedImage;
  //   newFile.name = base64CroppedImage.name;
  //   newFile.network = base64CroppedImage.type;
  //   let cFile: File;
  //   fetch(base64Data)
  //     .then(res => res.blob())
  //     .then(blob => {
  //       let convertedFile = new File([blob], base64CroppedImage.name, { type: 'image/png' });
  //       let croppedImageObj: FileToUploadModel = {
  //         networkType: base64CroppedImage.type,
  //         file: convertedFile
  //       }
  //       newFile.file = convertedFile;
  //       this.fillCampaignAndPostWithCroppedImage(newFile);
  //     })
  // }

  // makePostObject(createdCampaign, files) {
  //   this.selectedSocialAccountsArtifactsArray.forEach(element => {

  //     let postObj: Post = {
  //       scheduleDate: createdCampaign.scheduledAt,
  //       socialMediaAccountId: element.socialAccountObj.id,
  //       network: element.socialAccountObj.type,
  //       mediaFiles: [...files],
  //       error: '',
  //       status: createdCampaign.status,
  //       socialMediaInfo: element.pageObj,
  //       registerUserId: this.profileStore.userId,
  //       // campaignId:createdCampaign.id
  //     }
  //     this.postsArray.push(postObj);

  //   })
  //   console.log("post array", this.postsArray);
  // }

  // async createPostsForEachSocialAccount(createdCampaign) {

  //   let temp = this.campaignService.createPosts(this.postsArray, createdCampaign).subscribe(res => {
  //     this.postsArray = [];
  //     this.emptySelectedSocialArtifacts();
  //     console.log(res);
  //     // this.profileStore.loaderEnd();
  //     return res;
  //   }, err => {
  //     console.log(err);
  //     this.openSnackBar(err.message, 'close');
  //     return err;
  //   })
  //   return temp
  // }

  // makeCreateCampaignObjectForService(campaign) {

  //   this.createCampaignObjForService = {
  //     title: campaign.title,
  //     scheduledAt: campaign.dateTime,
  //     description: campaign.description,
  //     hashTags: campaign.hashTags,
  //     mediaFiles: campaign.mediaFiles,
  //     status: campaign.status,
  //     selectectedAccountsInfo: this.selectedSocialAccountsPageArray,
  //     createdAt: campaign.createdDate
  //   }

  // }
  // returnCroppedMediaFilesNames(uploadedImages, croppedImages: Array<FileToUploadModel>) {

  //   let result1 = JSON.parse(uploadedImages[0]._body);
  //   // console.log(result1);
  //   let imagesArray = _.map(result1.result.files.uploadFile, _.partialRight(_.pick, ['originalFilename', 'name', 'type']));
  //   imagesArray.forEach(image => {
  //     croppedImages.forEach((cImage, cIndex) => {
  //       if (image.originalFilename == cImage.file.name) {
  //         // let parentFile = this.campaignMediaFiles.find(x => x.originalFilename == imagesResult.file.name)
  //         image.network = cImage.networkType;
  //         image.isCropped = true;
  //         // image.tags = cImage.file.tags;
  //         // image.parentId = parentFile.name;
  //       }
  //     });

  //   });
  //   this.croppedImages = [];
  //   return imagesArray
  //   // console.log("cropped plus network", imagesArray);

  // }

  // async createCampaign(campaign: Campaign) {
  //   // await this.makeCreateCampaignObjectForService(campaign);
  //   // this.emptyAlertModel();

  //   let mediaFiles = [...campaign.mediaFiles];
  //   campaign.mediaFiles = [];
  //   this.profileStore.loaderStart();
  //   await this.campaignService.createCampaign(campaign).subscribe(async createdCampaign => {
  //     this.socket.emit("new create campaign", (createdCampaign.id));

  //     if (mediaFiles.length > 0) {
  //       await this.uploadingMediaFiles(mediaFiles, createdCampaign).subscribe(async files => {
  //         // this.campaignMediaFiles = files;
  //         this.uploadThumbnails(this.allThumbnails, [...files]).subscribe(filesWithThumbnails => {

  //           this.updateCampaignsWithUploadFiles(createdCampaign.id, filesWithThumbnails).subscribe(res => {
  //             console.log(res);
  //             // });

  //             if (this.selectedSocialAccountsArtifactsArray.length >= 1) {

  //               this.makePostObject(createdCampaign, [...filesWithThumbnails]);
  //               if (this.croppedImages.length >= 1) {
  //                 // await this.createPostsForEachSocialAccount(createdCampaign, files);
  //                 this.uploadingCroppedMediaFiles(this.croppedImages).
  //                   subscribe(croppedfiles => {
  //                     console.log("cropped Images", croppedfiles);
  //                     console.log("postsArray", this.postsArray);
  //                     croppedfiles.forEach(cImages => {
  //                       // let posts = this.postsArray.find(x => x.network == cImages.network)
  //                       // this.postsArray.forEach(posts => {

  //                       for (let i = 0; i < this.postsArray.length; i++) {
  //                         console.log(files);
  //                         if (this.postsArray[i].network == cImages.network || cImages.network == 'All') {
  //                           let imageFound = -1
  //                           if (cImages.network == 'All') {
  //                             imageFound = this.postsArray[i].mediaFiles.findIndex(y => 'All-' + y.originalFilename == cImages.originalFilename)
  //                           }
  //                           if (imageFound == -1) {
  //                             imageFound = this.postsArray[i].mediaFiles.findIndex(y => cImages.network + '-' + y.originalFilename == cImages.originalFilename)
  //                           }

  //                           if (imageFound > -1) {
  //                             let tags = this.postsArray[i].mediaFiles[imageFound]._tags;
  //                             let thumbnail = this.postsArray[i].mediaFiles[imageFound].thumbnail;

  //                             this.postsArray[i].mediaFiles[imageFound] = {};
  //                             this.postsArray[i].mediaFiles[imageFound].id = UUID.UUID();
  //                             this.postsArray[i].mediaFiles[imageFound].name = cImages.name
  //                             this.postsArray[i].mediaFiles[imageFound].thumbnail = thumbnail;
  //                             if (tags) {
  //                               this.postsArray[i].mediaFiles[imageFound]._tags = tags;
  //                             }
  //                             this.postsArray[i].mediaFiles[imageFound].network = cImages.network;
  //                             this.postsArray[i].mediaFiles[imageFound].originalFilename = cImages.originalFilename;
  //                             this.postsArray[i].mediaFiles[imageFound].isCropped = true;
  //                             this.postsArray[i].error = "changes";
  //                             // imageFound.parentId =cImages.parentId;
  //                           }
  //                         }
  //                       }
  //                       // });
  //                     });
  //                     console.log(this.postsArray);
  //                     // this.createPostsForEachSocialAccount(createdCampaign);
  //                     // this.makePostObjectWithEmptyFiles(createdCampaign);
  //                     this.createPostsForEachSocialAccount(createdCampaign).then(res => {
  //                       this.campaignService.setCamapign().subscribe(res => {
  //                         this.profileStore.loaderEnd();
  //                         this.openDialog();
  //                         this.refreshAllVariables();
  //                       });
  //                     });

  //                   })
  //               } else {
  //                 // this.makePostObjectWithEmptyFiles(createdCampaign);
  //                 this.createPostsForEachSocialAccount(createdCampaign).then(res => {
  //                   this.campaignService.setCamapign().subscribe(res => {
  //                     this.profileStore.loaderEnd();
  //                     this.openDialog();
  //                     this.refreshAllVariables();
  //                   });
  //                 });
  //               }
  //             } else {
  //               this.campaignService.setCamapign().subscribe(res => {
  //                 this.profileStore.loaderEnd();
  //                 this.openDialog();
  //                 this.refreshAllVariables();
  //               });
  //             }
  //           }, err => {
  //             this.openSnackBar(err.message, 'close');
  //             this.profileStore.loaderEnd();
  //           });
  //           // end updating campaign with media files
  //         })
  //       }, err => {
  //         this.openSnackBar(err.message, 'close');
  //         this.profileStore.loaderEnd();
  //       })
  //       if (mediaFiles.length == 0) {
  //         this.campaignService.setCamapign().subscribe(res => {
  //           this.profileStore.loaderEnd();
  //           this.openDialog();
  //           this.refreshAllVariables();
  //         });
  //       }
  //     } else {

  //       this.makePostObjectWithEmptyFiles(createdCampaign);
  //       this.createPostsForEachSocialAccount(createdCampaign).then(res => {
  //         this.campaignService.setCamapign().subscribe(res => {
  //           this.profileStore.loaderEnd();
  //           this.openDialog();
  //           this.refreshAllVariables();
  //         });
  //       });

  //     }

  //   }, err => {
  //     // this.isFormReset = false;
  //     // this.alertModel.isValidate = false;
  //     this.profileStore.loaderEnd();
  //     if (err.error) {
  //       // this.alertModel.messages.push(err.error.error.message);
  //       this.openSnackBar(err.error.error.message, 'close');
  //       // this.alertModel$.next(this.alertModel);
  //     } else if (err == 'Server error') {
  //       this.openSnackBar(err, 'close');
  //     } else {
  //       // this.errorMessage=err;
  //       this.openSnackBar(err.message, 'close');
  //       console.log(err.message);
  //     }
  //   });
  // }

  // uploadingCroppedMediaFiles(croppedFiles: Array<FileToUploadModel>) {

  //   return this.campaignService.uploadImage(croppedFiles.map(data => data.file)).map(res => {
  //     // if (this.returnMediaFilesNames(res).length > 0) {
  //     // this.updateCampaignsWithUploadFiles(campaignId, campaign, this.returnMediaFilesNames(res))
  //     // }

  //     let uploadedCroppedImages = [...res];
  //     return this.returnCroppedMediaFilesNames(uploadedCroppedImages, croppedFiles);

  //   }, err => {
  //     this.openSnackBar(err.message, 'close');
  //     // this.alertModel.messages.push("image uploading error");
  //     // this.alertModel$.next(this.alertModel);
  //   })

  // }
  // uploadingMediaFiles(mediaFiles, result) {
  //   let campaignId: any;
  //   campaignId = result['id'];
  //   // this.profileStore.loaderStart();
  //   return this.campaignService.uploadImage(mediaFiles).map(res => {

  //     return this.returnMediaFilesNames(mediaFiles, res);

  //   }, err => {
  //     this.openSnackBar(err.message, 'close');
  //     // this.alertModel.messages.push("image uploading error");
  //     // this.alertModel$.next(this.alertModel);
  //   })
  // }
  // updateCampaignsWithUploadFiles(campaignId, imagesObject) {
  //   // this.profileStore.loaderStart();
  //   return this.campaignService.updateCamapign(campaignId, imagesObject).map(res => {

  //     console.log(res);
  //     // this.profileStore.loaderEnd();
  //     return res;

  //   }, err => {
  //     this.openSnackBar(err.message, 'close');
  //     // this.openSnackBar("campaign is not updated successfully", 'close');
  //     // this.alertModel.messages.push("campaign is not updated successfully");
  //   })
  // }

  // returnMediaFilesNames(mediaFiles, res) {
  //   let result1 = JSON.parse(res[0]._body);
  //   // console.log(result1);
  //   let files = _.map(result1.result.files.uploadFile, _.partialRight(_.pick, ['originalFilename', 'name', 'type']));
  //   mediaFiles.forEach(persistFiles => {
  //     let imageFoundIndex = files.findIndex(x => x.originalFilename == persistFiles.name);
  //     if (imageFoundIndex > -1) {
  //       // files[imageFoundIndex]={};
  //       files[imageFoundIndex]._tags = persistFiles.tags;
  //       files[imageFoundIndex].isCropped = false;
  //       files[imageFoundIndex].id = UUID.UUID();
  //       // files[imageFoundIndex].ori
  //     }
  //   })

  //   return files;

  // }

  // uploadThumbnails(thumbnails, files) {

  //   return this.campaignService.uploadImage(thumbnails).map(uploadedThumbnails => {
  //     // files.forEach(mediaFile=>{
  //     // if(mediaFile.name==res)
  //     // })cons
  //     // this.profileStore.loaderEnd();
  //     this.allThumbnails = [];
  //     return this.updatemediaFilesWiththumbnails(uploadedThumbnails, files)
  //   })
  // }

  // updatemediaFilesWiththumbnails(uploadedThumbnails, mediafiles) {
  //   let result1 = JSON.parse(uploadedThumbnails[0]._body);
  //   // console.log(result1);
  //   let files = _.map(result1.result.files.uploadFile, _.partialRight(_.pick, ['originalFilename', 'name', 'type']));
  //   mediafiles.forEach(persistFiles => {
  //     var f = persistFiles.originalFilename.substr(0, persistFiles.originalFilename.lastIndexOf('.'));
  //     if (f == '') {
  //       f = persistFiles.originalFilename;
  //     }
  //     var type = persistFiles.originalFilename.split('.').pop();

  //     let imageFoundIndex = files.findIndex(x => x.originalFilename.substr(0, persistFiles.originalFilename.lastIndexOf('.')) == f);
  //     if (imageFoundIndex > -1) {
  //       // files[imageFoundIndex]={};
  //       persistFiles.thumbnail = files[imageFoundIndex].name;

  //       // files[imageFoundIndex].ori
  //     }
  //   })
  //   return mediafiles;
  // }

  // getThumbnailArray(ThumbnailArray) {
  //   //     const reader = new FileReader();
  //   // reader.onload = (e: any) => {
  //   //   let src = e.target.result;
  //   //   $("#videoimg").attr("src",src)
  //   //   console.log("video thumbnail image get src",src)
  //   // };
  //   // reader.readAsDataURL(ThumbnailArray[0]);
  //   this.allThumbnails = [...ThumbnailArray];
  //   console.log(this.allThumbnails);
  // }

  // makePostObjectWithEmptyFiles(createdCampaign) {
  //   this.selectedSocialAccountsArtifactsArray.forEach(element => {
  //     // let mediaFilesForPost = [...files]
  //     // mediaFilesForPost.forEach(image => {
  //     // image.parentId = image.name;
  //     // })
  //     let postObj: Post = {
  //       scheduleDate: createdCampaign.scheduledAt,
  //       socialMediaAccountId: element.socialAccountObj.id,
  //       network: element.socialAccountObj.type,
  //       mediaFiles: [],
  //       error: '',
  //       status: createdCampaign.status,
  //       socialMediaInfo: element.pageObj,
  //       registerUserId: this.profileStore.userId,
  //       // campaignId:createdCampaign.id
  //     }
  //     this.postsArray.push(postObj);

  //   })
  //   console.log("post array", this.postsArray);
  // }

  // emptySelectedSocialArtifacts() {
  //   this.selectedSocialAccountsArtifactsArray = [];
  //   this.selectedSocialAccountsArtifactsArray$.next(this.selectedSocialAccountsArtifactsArray);
  // }

  // code start for posts images details to show

  // makePostOnSocialArtifactSelection(selectedArtifact) {

  //   let postObj: Post = {
  //     scheduleDate: new Date(),
  //     socialMediaAccountId: selectedArtifact.socialAccountObj.id,
  //     network: selectedArtifact.socialAccountObj.type,
  //     mediaFiles: [],
  //     error: '',
  //     socialMediaInfo: selectedArtifact.pageObj,
  //     registerUserId: this.profileStore.userId,
  //     // campaignId:createdCampaign.id
  //   }
  //   // this.postsArrayToShow.push(postObj);
  //   // this.postsArrayToShow$.next(this.postsArrayToShow);

  //   if (this.originalFiles.length >= 1) {
  //     // this.fillPostsToShowWithOriginalImages();
  //   }
  //   if (this.croppedImages.length >= 1) {
  //     this.croppedImages.forEach(cImage => {
  //       // this.processNewCroppedImage(cImage);
  //     })

  //   }
  //   console.log("post array on network page selection", this.postsArrayToShow);
  // }

  // processCroppedImageToShow(base64CroppedImage) {
  //   if (this.croppedImagesToShow.length >= 1) {
  //     let found = this.croppedImagesToShow.find(x => x.name == base64CroppedImage.name);
  //     if (found) {
  //       this.replacePostsToShowCroppedImages(base64CroppedImage);
  //     } else {
  //       this.croppedImagesToShow.push(base64CroppedImage);
  //       console.log("cropped images to show", this.croppedImagesToShow);

  //       this.fillPostsToShowCroppedImages()
  //     }
  //   } else {
  //     this.croppedImagesToShow.push(base64CroppedImage);
  //     console.log("cropped images to show", this.croppedImagesToShow);

  //     this.fillPostsToShowCroppedImages()
  //   }
  // }

  // processNewCroppedImage(cImage) {
  //   // this.croppedImagesToShow.forEach(cImages => {

  //   for (let i = 0; i < this.postsArrayToShow.length; i++) {
  //     // console.log(files);
  //     if (this.postsArrayToShow[i].network == cImage.type || cImage.type == 'All') {
  //       let imageFound = -1;
  //       if (cImage.type == 'All') {
  //         imageFound = this.postsArrayToShow[i].mediaFiles.findIndex(y => 'All-' + y.name == cImage.name)
  //       }
  //       if (imageFound == -1) {
  //         imageFound = this.postsArrayToShow[i].mediaFiles.findIndex(y => cImage.type + '-' + y.name == cImage.name)
  //       }
  //       if (imageFound == -1) {
  //         imageFound = this.postsArrayToShow[i].mediaFiles.findIndex(y => y.name == cImage.name)
  //       }

  //       if (imageFound > -1) {
  //         // let tags = this.postsArrayToShow[i].mediaFiles[imageFound].tags;
  //         // let thumbnail = this.postsArrayToShow[i].mediaFiles[imageFound].thumbnail;
  //         var name = cImage.name.indexOf('-');
  //         console.log("cropped name without network", cImage.name.substring(name + 1, cImage.name.length));
  //         this.postsArrayToShow[i].mediaFiles[imageFound] = {};
  //         this.postsArrayToShow[i].mediaFiles[imageFound].name = cImage.name.substring(name + 1, cImage.name.length)
  //         this.postsArrayToShow[i].mediaFiles[imageFound].src = cImage.src;
  //         this.postsArrayToShow[i].mediaFiles[imageFound].type = 'image';
  //         // if (tags) {
  //         //   this.postsArrayToShow[i].mediaFiles[imageFound].tags = tags;
  //         // }
  //         // this.postsArrayToShow[i].mediaFiles[imageFound].network = cImage.type;
  //         // this.postsArrayToShow[i].mediaFiles[imageFound].originalFilename = cImages.file.name;
  //         // this.postsArrayToShow[i].mediaFiles[imageFound].isCropped = true;
  //         // this.postsArrayToShow[i].error = "changes";
  //         // imageFound.parentId =cImages.parentId;
  //       }
  //     }
  //   }
  //   this.postsArrayToShow$.next(this.postsArrayToShow);
  //   // });
  //   // });
  // }

  // replacePostsToShowCroppedImages(croppedImage) {
  //   for (let i = 0; i < this.postsArrayToShow.length; i++) {
  //     // console.log(files);
  //     if (this.postsArrayToShow[i].network == croppedImage.type || croppedImage.type == 'All') {
  //       let imageFound = this.postsArrayToShow[i].mediaFiles.findIndex(y => croppedImage.type + '-' + y.name == croppedImage.name)

  //       if (imageFound > -1) {

  //         var name = croppedImage.name.indexOf('-');
  //         console.log("cropped name without network", croppedImage.name.substring(name + 1, croppedImage.name.length));
  //         this.postsArrayToShow[i].mediaFiles[imageFound] = {};
  //         this.postsArrayToShow[i].mediaFiles[imageFound].name = croppedImage.name.substring(name + 1, croppedImage.name.length)
  //         this.postsArrayToShow[i].mediaFiles[imageFound].src = croppedImage.src;
  //         this.postsArrayToShow[i].mediaFiles[imageFound].type = 'image';
  //         this.postsArrayToShow[i].mediaFiles[imageFound].network = croppedImage.type;
  //       }
  //     }
  //   }
  //   this.postsArrayToShow$.next(this.postsArrayToShow);
  // }
}
