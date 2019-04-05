import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';
import { CampaignService } from "./../../shared/service/campaign.service";
import { Router, ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../shared/sdk';
// import { CampaignModel } from '../../campaign-definition/model/createCampaign.model';
import { GlobalDialogComponent } from '../../../shared/global-dialog/global-dialog.component';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { UserProfile } from "./../../../store/user-profile";
import { SocialAccountsStore } from "./../../../store/social-accounts-store";
import * as _ from "lodash";
import { SocialAccountForCreate } from './../../shared/components/my-attached-social-networks/model/social-account-for-create.model';
import { MyNetworkService } from '../../../membership/service/my-network.service';
import { retry, concat } from 'rxjs/operators';
import { Post } from 'src/app/shared/sdk/models';
import { subDays } from 'date-fns';
import { observable } from 'mobx';
import 'rxjs/add/observable/of';
import { EditCampaignViewModel } from './model/editCampaignViewModel';
import { FileToUploadModel } from '../../shared/components/campaign-definition/model/fileToUploadModel';
import { UUID } from 'angular2-uuid';
import { CampaignStatusEnum } from '../../shared/components/campaign-definition/model/status.model';
import { CampaignSocialAccountsService } from '../../shared/service/campaign-social-accounts.service';

import { Socket } from 'ng-socket-io';
import { CampaignsStore } from '../../../store/campaigns-store';
import { CampaignViewModel } from './../../shared/models/campaignViewModel'
import { CampaignContainerService } from '../../shared/service/campaign-container.service';
import { PostViewModel } from '../../shared/models/postViewModel';
import { MediaFileAssetViewModel } from '../../shared/models/mediaFileAssetViewModel';
import { MediaAssetConversionUtil } from '../../../shared/mediaAssetUtil/mediaAssetConversionUtil';
import { CampaignStatusStore } from "./../../../store/campaign-status-store";
import { CamapignStatusService } from "./../../custom-campaign-status/service/camapign-status.service";
import { CamapignStatusRoutingModule } from '../../custom-campaign-status/camapignStatus.routes';

@Component(
  {
    selector: 'edit-campaign-container',
    templateUrl: './edit-campaign-container.component.html',
    styleUrls: ['./edit-campaign-container.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
export class EditCampaignContainerComponent implements OnInit {
  campaignViewModel: CampaignViewModel;
  postsArrayToShow$: BehaviorSubject<Array<PostViewModel>>;
  selectedNetworks$: BehaviorSubject<Array<string>>;
  imagePath: any;
  // allThumbnails: Array<File> = [];
  myAttachedSocialAccounts$ = new BehaviorSubject(this.socialAccountsStore.socialAccounts);
  // croppedImagesToDeleteFromPersistPosts: Array<string> = [];
  // newImages: Array<any> = [];
  // croppedImages: Array<FileToUploadModel> = [];
  persistCampaign: Campaign;
  persistCampaign$ = new BehaviorSubject(this.campaignViewModel);
  editCampaignViewModel: EditCampaignViewModel;
  // socialAcountObj: SocialAccountForCreate;
  selectedSocialAccountsArtifactsArray: Array<SocialAccountForCreate> = [];
  selectedSocialAccountsArtifactsArray$ = new BehaviorSubject(this.selectedSocialAccountsArtifactsArray);
  // newSelectedSocialAccountsArtifactsArray: Array<SocialAccountForCreate> = [];
  // postsArray: Array<Post> = [];
  // persistPostsArray: Array<Post> = [];
  // persistPostsArray$ = new BehaviorSubject(this.persistPostsArray);
  isCommentsShow: boolean;
  commentsType: string;
  campaignComments$ = new BehaviorSubject(this.campaignStore.campaignComments);
  groupRights = require("../../../shared/config/group-rights.json").groupRights;

  constructor(public socket: Socket,
    public campaignContainerService: CampaignContainerService,
    public ref: ChangeDetectorRef,
    public campaignNetworkService: CampaignSocialAccountsService,
    private dialog: MatDialog,
    public socialAccountService: MyNetworkService,
    public snackBar: MatSnackBar,
    public camapignStatusService: CamapignStatusService,
    private _Activatedroute: ActivatedRoute,
    private _router: Router,
    public profileStore: UserProfile,
    public socialAccountsStore: SocialAccountsStore,
    public campaignService: CampaignService,
    public campaignStore: CampaignsStore,
    public campaignStatusStore: CampaignStatusStore,
    public mediaAssetUtil: MediaAssetConversionUtil) {
    this.editCampaignViewModel = new EditCampaignViewModel();
    this.campaignStore.resetCampaignComments();
    this.getMessage();
    this.campaignViewModel = new CampaignViewModel();
    this.postsArrayToShow$ = new BehaviorSubject(this.campaignViewModel.posts);
    this.selectedNetworks$ = new BehaviorSubject([]);

    // this.inputSelectedSocialAccountsArrayWithPages = [];
  }
  // fileRead(files: Array<MediaFileAssetViewModel>){

  //     return new Promise((resolve, reject) => {
  //       length = 0;
  //       files.forEach(serverfile => {
  //         if (serverfile.type != "video/mp4") {
  //           // let fileUrl = this.imagePath + file.name;
  //           let cFile = { name: '', src: '', type: '' };
  //           cFile.src = this.imagePath + serverfile.name;
  //           cFile.name = serverfile.originalFilename;
  //           cFile.type = serverfile.type;
  //           this.mediaAssetUtil.base64ToFile(cFile).then((file: File) => {
  //             // serverfile.file = file;

  //             serverfile.base64File.name = file.name;
  //             this.mediaAssetUtil.fileToBase64(file).then(res => {
  //               serverfile.base64File.src = res;
  //               serverfile.base64File.type = file.type;
  //               serverfile.type = file.type;
  //               serverfile.base64File.thumbnailName = serverfile.thumbnailName;
  //               // serverfiles.croppedImages = [];
  //               length++;
  //               if (files.length == length) {
  //                 return resolve(files);
  //               }
  //             }).catch(
  //               error => console.log(error)
  //             )
  //           });
  //         } else {
  //           length++

  //           if (files.length == length) {
  //             return resolve(files);
  //           }
  //         }
  //       })

  //     })
  // }
  async fillFiles() {
    let files = await this.campaignContainerService.fileRead(false, true, this.campaignViewModel.mediaFiles);
    if (files) {
      this.persistCampaign$.next(this.campaignViewModel);
    }

  }
  ngOnInit() {

    this.imagePath = require('./../../../shared/config/urls.json').IMAGE_DOWNLOAD_END_POINT_URL;
    this.isCommentsShow = false;
    this.getCustomStatus();
    this.getSocialnetwork();
    this.profileStore.loaderStart();
    this.editCampaignViewModel.id = this._Activatedroute.snapshot.queryParams['id'];
    this.campaignService.getCampaignForEdit(this.editCampaignViewModel.id).subscribe((res: Campaign) => {
      this.persistCampaign = res;
      this.campaignViewModel.populateFromServerModel(this.persistCampaign)
      console.log("persist to view from edit container", this.campaignViewModel);
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
          }
          socialAccountArtifacts.push(socialAcountObj);
        });
        // this.campaignViewModel.posts = [];

        socialAccountArtifacts.forEach(element => {
          let socialAccount = this.socialAccountsStore.socialAccounts.find(x => x.id == element.socialAccountObj.id && element.socialAccountObj.status == 'connected')
          if (socialAccount) {
            // element = new PostViewModel();
            this.selectedSocialAccountsArtifactsArray.push(element);
            this.selectedSocialAccountsArtifactsArray$.next(this.selectedSocialAccountsArtifactsArray);
            // this.uniquSelectedSocialNetworks()
            this.selectedNetworks$.next(this.campaignContainerService.uniquSelectedSocialNetworks(this.selectedSocialAccountsArtifactsArray));

            // this.addSelectedSocialAccountArtifact(element);
          }
        })

      }


      // if (this.campaignViewModel.posts.length >= 1) {

      //   this.campaignViewModel.posts.map(x => Object.assign({}, x));
      //   // if (this.campaignViewModel.state == 'Posted' || this.campaignViewModel.state == 'Canceled') {
      //   //   this.campaignViewModel.posts.forEach(post => {
      //   //     // becaues we want to upload same media files with new referance
      //   //     post.mediaFiles = [];
      //   //   })
      //   // }

      //   this.campaignViewModel.posts.forEach(element => {
      //     // here we filled already selected social accounts and remove if there  network
      //     // is no longer connected

      //     let socialAcountObj = {
      //       socialAccountObj: element.socialMediaAccounts,
      //       pageObj: element.socialMediaInfo
      //     }
      //     this.socialAccountsStore.socialAccounts.forEach(accoounts => {
      //       if (accoounts.id == element.socialMediaAccounts.id && element.socialMediaAccounts.status == 'connected') {
      //         this.selectedSocialAccountsArtifactsArray.push(socialAcountObj);
      //         this.selectedSocialAccountsArtifactsArray$.next(this.selectedSocialAccountsArtifactsArray);
      //       } else if (accoounts.id == element.socialMediaAccounts.id) {
      //         this.onRemoveAccountsArtifact(socialAcountObj);
      //         this.selectedSocialAccountsArtifactsArray$.next(this.selectedSocialAccountsArtifactsArray);
      //       }
      //       this.uniquSelectedSocialNetworks();
      //     });
      //     // fille media files with respect to campaign mode if edit mode or reschedule
      //     // mode
      //     let post
      //     // if (this.campaignViewModel.state == 'Posted' || this.campaignViewModel.state == 'Canceled') {
      //     //   post = Object.assign({}, element);
      //     //   post.mediaFiles = [];
      //     // } else {
      //     post = Object.assign({}, element);
      //     post.mediaFiles = Object.assign([], element.mediaFiles);
      //     // }

      //     // passing to child component to show files in tiles
      //     // this.campaignViewModel.postsArrayToShow.push(post);
      //     this.postsArrayToShow$.next(this.campaignViewModel.posts);

      //   });

      //   // checking if edit case or reschedule case if new then push posts as new posts 
      //   // if (this.campaignViewModel.state == 'Posted' || this.campaignViewModel.state == 'Canceled') {
      //   //   let selctedAccountsArray = [...this.selectedSocialAccountsArtifactsArray];
      //   //   selctedAccountsArray.forEach(artifact => {
      //   //     if (artifact.socialAccountObj.status == 'connected') {
      //   //       this.newSelectedSocialAccountsArtifactsArray.push(artifact);
      //   //     }
      //   //   })
      //   // }
      // }
    });



  }

  getCustomStatus() {
    if (this.campaignStatusStore.customStatuses.length == 0) {
      this.camapignStatusService.getCustomStatus().subscribe(response => {
      })
    }
  }
  onChangeDescription(description: string) {
    this.campaignViewModel = this.campaignContainerService.onChangeDescription(description, this.campaignViewModel);
    this.postsArrayToShow$.next(this.campaignViewModel.posts);

  }

  openSnackBar(message: string, action: string) {
    this
      .snackBar
      .open(message, action, { duration: 5000 });
  }

  onAddOrRemoveTags(image) {
    this.campaignViewModel = this.campaignContainerService.onAddOrRemoveTags(image, this.campaignViewModel);
  }

  onInputImageTagsEdit(image) {
    this.persistCampaign.mediaFiles.forEach(imageFile => {
      if (image.name == imageFile.originalFilename) {
        imageFile._tags = image.tags;
      }
    });
  }

  onUpdate = (campaign: CampaignViewModel) => {
    this.campaignContainerService.assignScheduleDate(campaign).subscribe(queDate => {
      this.campaignViewModel.scheduledAt = queDate;

      this.campaignViewModel.title = campaign.title;
      // this.campaignViewModel.scheduledAt = campaign.scheduledAt;
      this.campaignViewModel.state = campaign.state;
      this.campaignViewModel.campaignStatuses = campaign.campaignStatuses;
      this.campaignViewModel.ownerId = this.profileStore.userId;

      this.campaignViewModel.type = this.campaignContainerService.changeCampaignType(campaign);
      // this.campaignViewModel.mediaFiles = [...campaign.mediaFiles];
      this.profileStore.loaderStart();
      this.campaignContainerService.updateCampaign(this.campaignViewModel).subscribe(updatedCampaign => {
        this.campaignService.getCamapign().subscribe(res => {
          // this.socket.emit("new create campaign", (createdCampaign.id));
          this.profileStore.loaderEnd();
          this.openDialog();
          // this.refreshAllVariables();
        });
      }, err => {
        if (err = "Server error") {
          this.openSnackBar('server is not responding', 'close');
        } else {
          this.openSnackBar(err.message, 'close');
        }

        this.profileStore.loaderEnd();
      });
    }, err => {
      this.openSnackBar(err, 'close');
    })
  }


  // deletePostsToShow = (socialAccountsArtifact: SocialAccountForCreate) => {
  //   let findIndex = this.campaignViewModel.posts.findIndex(x => x.socialMediaAccountId == socialAccountsArtifact.socialAccountObj.id &&
  //     x.socialMediaInfo.id == socialAccountsArtifact.pageObj.id);

  //   if (findIndex > -1) {
  //     if (this.campaignViewModel.posts[findIndex].id && this.campaignViewModel.posts[findIndex].id != '') {
  //       this.campaignViewModel.postsToDelete.push(this.campaignViewModel.posts[findIndex]);
  //       // this.deleteCroppedImagesfromDeletedPost(this.campaignViewModel.posts[findIndex].mediaFiles);
  //     }
  //     this.campaignViewModel.posts.splice(findIndex, 1);
  //     this.postsArrayToShow$.next(this.campaignViewModel.posts);


  //   }
  // }

  onRemoveAccountsArtifact(socialAccountsArtifact: SocialAccountForCreate) {

    this.campaignNetworkService.removeSelectedSocialAccounts(socialAccountsArtifact, this.selectedSocialAccountsArtifactsArray)
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

  // uniquSelectedSocialNetworks() {
  //   var selectedNetworks = [];
  //   let found = -1
  //   this.selectedSocialAccountsArtifactsArray.forEach(account => {

  //     selectedNetworks.push(account.socialAccountObj.type);
  //   })

  //   function onlyUnique(value, index, self) {
  //     return self.indexOf(value) === index;
  //   }

  //   var uniqueSelectedNetworks = selectedNetworks.filter(onlyUnique);
  //   this.selectedNetworks$.next(uniqueSelectedNetworks);
  // }


  getSocialnetwork = () => {
    if (this.socialAccountsStore.socialAccounts.length == 0) {
      this.socialAccountService.myAccounts().subscribe(res => {
        this.myAttachedSocialAccounts$.next(this.socialAccountsStore.socialAccounts);
        // this.ref.detectChanges();
      })
    }
  }

  openDialog = () => {
    this._router.navigateByUrl('campaign/campaign-list');
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      heading: (this.persistCampaign.state == 'Posted' || this.persistCampaign.state == 'Canceled'
        ? 'Campaign has been created successfully'
        : 'Campaign has been updated successfully')
    };
    const dialogRef = this
      .dialog
      .open(GlobalDialogComponent, dialogConfig);

  }

  addSelectedSocialAccountArtifact(selectedArtifact) {
    let needToAdd = false;
    needToAdd = this.campaignNetworkService.onSelectSocialArtifact(selectedArtifact, this.selectedSocialAccountsArtifactsArray)
    if (needToAdd) {
      this.selectedSocialAccountsArtifactsArray.push(selectedArtifact);
      this.selectedSocialAccountsArtifactsArray$.next(this.selectedSocialAccountsArtifactsArray);
      this.makePostForViewModel(selectedArtifact)
      // this.uniquSelectedSocialNetworks();
      this.selectedNetworks$.next(this.campaignContainerService.uniquSelectedSocialNetworks(this.selectedSocialAccountsArtifactsArray));

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

      this.campaignViewModel = this.campaignContainerService.fillCampaignAndPostWithCroppedImage(newFile, this.campaignViewModel);
      this.postsArrayToShow$.next(this.campaignViewModel.posts);
    })
  }

  makePostForViewModel(selectedArtifact) {

    this.campaignViewModel = this.campaignContainerService.makePostOnAddnewNetwork(selectedArtifact, this.campaignViewModel, this.selectedSocialAccountsArtifactsArray);
    this.selectedSocialAccountsArtifactsArray$.next(this.selectedSocialAccountsArtifactsArray);
    this.postsArrayToShow$.next(this.campaignViewModel.posts);
    // let postViewObj: PostViewModel = new PostViewModel();

    // // postViewObj.scheduleAt = this.campaignViewModel.scheduledAt;
    // postViewObj.description = this.campaignViewModel.description;
    // postViewObj.socialMediaAccountId = selectedArtifact.socialAccountObj.id,
    //   postViewObj.network = selectedArtifact.socialAccountObj.type;
    // postViewObj.ownerId = this.profileStore.userId;
    // postViewObj.error = '';
    // postViewObj.socialMediaInfo = Object.assign({}, selectedArtifact.pageObj);
    // //postViewObj.mediaFiles=this.campaignViewModel.mediaFiles;
    // let isCropedImageExist: boolean = false;
    // if (this.campaignViewModel.mediaFiles.length >= 1) {
    //   this.campaignViewModel.mediaFiles.forEach(x => {
    //     isCropedImageExist = false;

    //     if (x.croppedImages.length >= 1) {
    //       var cropedImage = x.croppedImages.find(x => x.network == postViewObj.network || x.network == "All")
    //       if (cropedImage) {
    //         postViewObj.mediaFiles.push(Object.assign({}, cropedImage));
    //         isCropedImageExist = true;
    //       }
    //     }

    //     if (!isCropedImageExist) {
    //       let file: MediaFileAssetViewModel = new MediaFileAssetViewModel();
    //       file.base64File = Object.assign({}, x.base64File);
    //       file.croppedImages = Object.assign([], x.croppedImages);
    //       file.file = Object.assign({}, x.file);
    //       file.name = x.name;
    //       if(x.id && x.id!=''){
    //         file.originalFilename = x.originalFilename;
    //         file.thumbnailName = x.thumbnailName;
    //         file.id = x.id;
    //       }
    //       file.tags = Object.assign([], x.tags);
    //       file.type = x.type;
    //       file.isCropped = false;

    //       postViewObj.mediaFiles.push(Object.assign({ croppedImages: [] }, file));
    //     }

    //   });

    // }


    // this.campaignViewModel.posts.push(postViewObj);
    // this.postsArrayToShow$.next(this.campaignViewModel.posts);
  }
  openCommnetsBar = () => {
    this.isCommentsShow = true;
    this.commentsType = "campaign";
    this.campaignService.getComments(this.editCampaignViewModel.id).subscribe(res => {
      this.campaignComments$.next(this.campaignStore.campaignComments)
    });
  }
  sendMessage = () => {
    this.socket.emit("message", this.editCampaignViewModel.id);
  }

  getMessage = () => {
    this.socket.on("message", (data) => {
      if (data && data.id === this.editCampaignViewModel.id) {
        this.campaignStore.addCampaignCommnets(data);
        this.campaignComments$.next(this.campaignStore.campaignComments);
      }

    });
  }
  newComment = ($event) => {
    this.campaignService.sendComment(this.editCampaignViewModel.id, $event).subscribe(res => {
      this.sendMessage();
    })

  }
  commentReply = ($event) => {
    ;
    this.campaignService.replyComment(this.editCampaignViewModel.id, $event.msg, $event.p_id).subscribe(res => {
      this.sendMessage();
    })
  }
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
    this.campaignViewModel = this.campaignContainerService.removeMediaFileFromCampaignViewModel(incomingFile, this.campaignViewModel);
    let postsWithFile = this.campaignViewModel.posts.filter(x => x.mediaFiles.find(x => (x.name == incomingFile.name) ||
      (x.originalFilename == incomingFile.originalFilename) || (x.name == incomingFile.originalFilename)));
    let duplicateFound = false;
    let indexesOfPosts = [];
    postsWithFile.forEach(post => {
      let ifDuplicate = this.campaignViewModel.posts.filter(x => x.socialMediaAccountId == post.socialMediaAccountId && x.socialMediaInfo.id == post.socialMediaInfo.id);
      if (ifDuplicate.length > 1) {
        duplicateFound = true;
      }
      if (duplicateFound && post.mediaFiles.length == 1 && ((incomingFile.type == 'video/mp4' && post.type == 'video') ||
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


    // this.campaignViewModel = this.campaignContainerService.onRemovemediaFile(incomingFile, this.campaignViewModel);
    // this.postsArrayToShow$.next(this.campaignViewModel.posts);
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

    // this.campaignViewModel = this.campaignContainerService.onAddMediaFile(newFile, this.campaignViewModel);
    // this.postsArrayToShow$.next(this.campaignViewModel.posts);
  }
  addThumbnailInNewFile(thumbnail: any) {
    let file = this.campaignViewModel.mediaFiles.find(x => x.name == thumbnail.file.name);
    if (file) {
      file.thumbnailFile = thumbnail;
    }
  }

  // deleteFromPersistPosts = (socialAccountsArtifact) => {
  //   if (this.persistPostsArray.length >= 1) {
  //     this.persistPostsArray.forEach((element, index) => {
  //       if (element.socialMediaAccounts.id == socialAccountsArtifact.socialAccountObj.id && element.socialMediaInfo.id == socialAccountsArtifact.pageObj.id) {
  //         this.selectedSocialAccountsArtifactsArray.splice(index, 1);
  //         this.selectedSocialAccountsArtifactsArray$.next(this.selectedSocialAccountsArtifactsArray);
  //       }
  //     });
  //     // this.persistPostsArray$.next(this.persistPostsArray);
  //     console.log("persist posts", this.persistPostsArray);
  //     this.selectedSocialAccountsArtifactsArray$.next(this.selectedSocialAccountsArtifactsArray);
  //   }
  // }
  // updateCampaign(editedCampaign: Campaign) {
  //   this.profileStore.loaderStart();
  //   if (this.editCampaignViewModel.toRemovePictures.length >= 1) {
  //     this.removeMediaFiles();
  //   }

  //   if (editedCampaign.mediaFiles.length >= 1) {
  //     this.uploadingMediaFiles(editedCampaign.mediaFiles).subscribe(files => {
  //       this.uploadThumbnails(this.allThumbnails, [...files]).subscribe(filesWithThumbnails => {

  //         editedCampaign.mediaFiles = [];
  //         if (this.persistCampaign.status == 'Scheduled' || this.persistCampaign.status == 'Draft') {
  //           // for edit case
  //           editedCampaign.mediaFiles = this.persistCampaign.mediaFiles.concat(filesWithThumbnails);
  //           this.newImages = [...filesWithThumbnails];

  //           this.persistPostsArray.forEach(post => {
  //             post.mediaFiles = post.mediaFiles.concat(this.newImages);
  //           });
  //         } else {
  //           // for new campaign case
  //           editedCampaign.mediaFiles = [];
  //           editedCampaign.mediaFiles = filesWithThumbnails;
  //           this.newImages = [...filesWithThumbnails];

  //           this.persistPostsArray.forEach(post => {
  //             post.mediaFiles = this.newImages;
  //           });
  //         }

  //         // this.persistPostsArray$.next(this.persistPostsArray);
  //         this.afterMediaFilesCheck(editedCampaign);
  //       })
  //     }, err => {
  //       console.log(err);
  //     });
  //   } else {
  //     if (this.persistCampaign.status == 'Posted' || this.persistCampaign.status == 'Canceled') {
  //       this.afterMediaFilesCheck(editedCampaign);
  //     } else {
  //       editedCampaign.mediaFiles = this.persistCampaign.mediaFiles;
  //       this.afterMediaFilesCheck(editedCampaign);
  //     }
  //   }
  // }

  // afterMediaFilesCheck(editedCampaign) {
  //   this.editCampaignViewModel.toRemovePictures = [];
  //   if (this.persistCampaign.status == 'Posted' || this.persistCampaign.status == 'Canceled') {
  //     this.forCreateNew(editedCampaign);

  //   } else {
  //     this.forEditCampaign(editedCampaign);

  //     if (this.editCampaignViewModel.postsToRemove.length >= 1) {

  //       this.campaignService.removePosts(this.editCampaignViewModel.postsToRemove).subscribe(res => {
  //         console.log(res);
  //       });
  //     }
  //     // add social accounts pages

  //   }
  // }

  // changeCampaignType(campaign) {
  //   // let campaigntype = campaign;
  //   return (campaign.mediaFiles.length == 0 ? 'text' : campaign.mediaFiles.length > 1 ? 'multiple-images'
  //     : campaign.mediaFiles.length == 1 && campaign.mediaFiles[0].type == 'video/mp4' ? 'video'
  //       : campaign.mediaFiles.length == 1 && (campaign.mediaFiles[0].type == "image/png" || campaign.mediaFiles[0].type == "image/jpeg")
  //         ? 'image'
  //         : '')
  // }

  // forCreateNew(campaign) {
  //   campaign.type = this.changeCampaignType(campaign);

  //   this.campaignService.createCampaign(campaign).subscribe(createdCampaign => {
  //     if (this.selectedSocialAccountsArtifactsArray.length >= 1) {
  //       this.makePostObject(createdCampaign);
  //       this.createOrUpdatePostsForCroppedImages(createdCampaign);
  //       this.campaignService.setCamapign().subscribe(res => {
  //         this.openDialog();
  //         this._router.navigateByUrl('campaign/campaign-list');
  //         this.profileStore.loaderEnd();
  //       });
  //     } else {
  //       this.campaignService.setCamapign().subscribe(res => {
  //         this.openDialog();
  //         this._router.navigateByUrl('campaign/campaign-list');
  //         this.profileStore.loaderEnd();
  //       });

  //     }

  //   }, err => {
  //     console.log(err);
  //   })
  // }

  // forEditCampaign(campaign) {

  //   campaign.type = this.changeCampaignType(campaign);
  //   this.campaignService.editCampaign(this.editCampaignViewModel.id, campaign).subscribe(updatedCampaign => {
  //     console.log(updatedCampaign);
  //     if (this.newSelectedSocialAccountsArtifactsArray.length >= 1) {
  //       this.makePostObject(updatedCampaign);
  //     }

  //     if (this.selectedSocialAccountsArtifactsArray.length >= 1) {

  //       this.createOrUpdatePostsForCroppedImages(updatedCampaign);
  //     }

  //     // if (this.selectedSocialAccountsArtifactsArray.length == 0   &&
  //     // this.newSelectedSocialAccountsArtifactsArray.length == 0) {

  //     this.campaignService.setCamapign().subscribe(res => {
  //       this.openDialog();
  //       this._router.navigateByUrl('campaign/campaign-list');
  //       this.profileStore.loaderEnd()
  //     })
  //     // }

  //   }, err => {
  //     console.log(err);
  //   })
  // }


  // updatePostArrayWithCroppedImages(updatedCampaign, croppedImages) {

  //   croppedImages.forEach(cImages => {
  //     for (let i = 0; i < this.postsArray.length; i++) {
  //       // let posts = this.postsArray.find(x => x.network == cImages.network); if
  //       // (posts) {
  //       let imageFound = -1;
  //       if (this.postsArray[i].network == cImages.network || cImages.network == 'All') {
  //         imageFound = this.postsArray[i].mediaFiles.findIndex(y => y.originalFilename == cImages.originalFilename)

  //         if (imageFound == -1) {
  //           imageFound = this.postsArray[i].mediaFiles.findIndex(y => cImages.network + '-' + y.originalFilename == cImages.originalFilename)
  //         }

  //         if (imageFound == -1) {
  //           imageFound = this.postsArray[i].mediaFiles.findIndex(y => 'All-' + y.originalFilename == cImages.originalFilename)
  //         }

  //         if (imageFound > -1) {
  //           let tags: Array<string> = [];
  //           if (this.postsArray[i].mediaFiles[imageFound]._tags.length >= 1) {
  //             tags = this.postsArray[i].mediaFiles[imageFound]._tags;
  //           }
  //           let thumbnail = this.postsArray[i].mediaFiles[imageFound].thumbnail;

  //           this.postsArray[i].mediaFiles[imageFound] = {};

  //           this.postsArray[i].mediaFiles[imageFound].id = UUID.UUID();
  //           this.postsArray[i].mediaFiles[imageFound].name = cImages.name;
  //           this.postsArray[i].mediaFiles[imageFound].network = cImages.network;
  //           this.postsArray[i].mediaFiles[imageFound].thumbnail = thumbnail;
  //           if (tags) {
  //             this.postsArray[i].mediaFiles[imageFound]._tags = tags;
  //           }
  //           this.postsArray[i].mediaFiles[imageFound].isCropped = true;
  //           this.postsArray[i].mediaFiles[imageFound].originalFilename = cImages.originalFilename;
  //           this.postsArray[i].mediaFiles[imageFound].type = cImages.type;

  //           // imageFound.parentId =cImages.parentId;
  //         }
  //       }
  //     }
  //     // }
  //   });

  //   this.createPostsForEachSocialAccount(updatedCampaign).subscribe();
  // }

  // updatePersistPostsWithCroppedImages(croppedImages) {
  //   croppedImages.forEach(cImages => {

  //     // let posts = this.persistPostsArray.find(x => x.network == cImages.network);
  //     for (let i = 0; i < this.persistPostsArray.length; i++) {
  //       // if (posts) {
  //       if (this.persistPostsArray[i].mediaFiles.length >= 1) {
  //         if (cImages.network == this.persistPostsArray[i].network || cImages.network == 'All') {
  //           let imageFound = -1
  //           if (cImages.network == 'All') {
  //             imageFound = this.persistPostsArray[i].mediaFiles.findIndex(y => y.originalFilename == cImages.originalFilename || 'All-' + y.originalFilename == cImages.originalFilename)
  //           }
  //           if (imageFound == -1) {
  //             imageFound = this.persistPostsArray[i].mediaFiles.findIndex(y => y.originalFilename == cImages.originalFilename || cImages.network + '-' + y.originalFilename == cImages.originalFilename)
  //           }
  //           if (imageFound == -1) {
  //             var name = cImages.originalFilename.indexOf('-');
  //             console.log("cropped name without network", cImages.originalFilename.substring(name + 1, cImages.originalFilename.length));

  //             imageFound = this.persistPostsArray[i].mediaFiles.findIndex(y => y.originalFilename == this.persistPostsArray[i].network + '-' + cImages.originalFilename.substring(name + 1, cImages.originalFilename.length))
  //           }
  //           if (imageFound == -1) {
  //             var name = cImages.originalFilename.indexOf('-');
  //             console.log("cropped name without network", cImages.originalFilename.substring(name + 1, cImages.originalFilename.length));

  //             imageFound = this.persistPostsArray[i].mediaFiles.findIndex(y => y.originalFilename == 'All-' + cImages.originalFilename.substring(name + 1, cImages.originalFilename.length))
  //           }

  //           if (imageFound > -1) {
  //             let tags = this.persistPostsArray[i].mediaFiles[imageFound]._tags;
  //             let thumbnail = this.persistPostsArray[i].mediaFiles[imageFound].thumbnail;

  //             this.persistPostsArray[i].mediaFiles[imageFound] = {}
  //             this.persistPostsArray[i].mediaFiles[imageFound].id = UUID.UUID();
  //             this.persistPostsArray[i].mediaFiles[imageFound].name = cImages.name;
  //             this.persistPostsArray[i].mediaFiles[imageFound].network = cImages.network;
  //             this.persistPostsArray[i].mediaFiles[imageFound].thumbnail = thumbnail;
  //             if (tags) {
  //               this.persistPostsArray[i].mediaFiles[imageFound]._tags = tags;
  //             }
  //             this.persistPostsArray[i].mediaFiles[imageFound].isCropped = true;
  //             this.persistPostsArray[i].mediaFiles[imageFound].originalFilename = cImages.originalFilename;
  //             this.persistPostsArray[i].mediaFiles[imageFound].type = cImages.type;

  //           } else {

  //             this.persistPostsArray[i].mediaFiles[imageFound] = {};

  //             this.persistPostsArray[i].mediaFiles.push(cImages);
  //           }
  //         }
  //       } else {
  //         if (this.persistPostsArray[i].network == cImages.network || cImages.network == 'All') {
  //           this.persistPostsArray[i].mediaFiles = [];
  //           this.persistPostsArray[i].mediaFiles.push(cImages);
  //         }

  //       }
  //       // }
  //     }
  //   });

  //   this.campaignService
  //     .updatePosts(this.persistPostsArray).subscribe(updatedPosts => {

  //     })
  //   // this.persistPostsArray$.next(this.persistPostsArray);
  //   // this.campaignService.updatePosts(this.persistPostsArray).subscribe(updatedPosts => {
  //   //   // this.openSnackBar('updatedPosts', 'close');
  //   // });

  // }

  // createOrUpdatePostsForCroppedImages(updatedCampaign) {

  //   if (this.croppedImages.length >= 1) {

  //     this
  //       .uploadingCroppedMediaFiles(this.croppedImages)
  //       .subscribe(async croppedImages => {

  //         if (this.postsArray.length >= 1) {
  //           await this.updatePostArrayWithCroppedImages(updatedCampaign, croppedImages);
  //         }
  //         if (this.persistPostsArray.length >= 1) {
  //           await this.updatePersistPostsWithCroppedImages(croppedImages);
  //         }
  //         console.log(this.postsArray);
  //         if (this.croppedImagesToDeleteFromPersistPosts.length >= 1) {
  //           this.campaignService.updatePosts(this.persistPostsArray).subscribe(res => { });

  //         }
  //         setTimeout(() => {
  //           this.campaignService.setCamapign().subscribe(res => { });
  //         }, 2000);

  //       });
  //   } else {
  //     // if there are new posts with same files
  //     if (this.newSelectedSocialAccountsArtifactsArray.length >= 1) {
  //       this.createPostsForEachSocialAccount(updatedCampaign).subscribe(res => { });
  //     }
  //     // if campaign is rescheduled as new and there are new files, cropped or files
  //     // removed
  //     if ((this.newImages.length >= 1 || this.croppedImagesToDeleteFromPersistPosts.length >= 1) && (this.persistCampaign.status == CampaignStatusEnum.addToQueue || this.persistCampaign.status == CampaignStatusEnum.draft || this.persistCampaign.status == CampaignStatusEnum.scheduled)) {
  //       this.campaignService.updatePosts(this.persistPostsArray).subscribe(res => { });
  //     }

  //   }
  // }


  // returnCroppedMediaFilesNames(uploadedImages, croppedImages: Array<FileToUploadModel>) {

  //   let result1 = JSON.parse(uploadedImages[0]._body);
  //   // console.log(result1);
  //   let imagesArray = _.map(result1.result.files.uploadFile, _.partialRight(_.pick, ['originalFilename', 'name', 'type']));
  //   imagesArray.forEach((image, index) => {
  //     // let imagesResult = croppedImages.find(x => x.file.name ==
  //     // image.originalFilename)
  //     croppedImages.forEach((cImage, cIndex) => {
  //       if (image.originalFilename == cImage.file.name) {
  //         // let parentFile = this.newImages.find(x => x.originalFilename ==
  //         // imagesResult.file.name);

  //         image.network = cImage.networkType;
  //         // image.parentId = parentFile.name;
  //       }
  //     })

  //   });

  //   return imagesArray
  //   // console.log("cropped plus network", imagesArray);

  // }

  // uploadingCroppedMediaFiles(croppedFiles: Array<FileToUploadModel>) {

  //   return this
  //     .campaignService.uploadImage(croppedFiles.map(data => data.file)).map(res => {
  //       // if (this.returnMediaFilesNames(res).length > 0) {
  //       // this.updateCampaignsWithUploadFiles(campaignId, campaign,
  //       // this.returnMediaFilesNames(res)) }
  //       let uploadedCroppedImages = [...res]
  //       return this.returnCroppedMediaFilesNames(uploadedCroppedImages, croppedFiles);

  //     }, err => {
  //       this.openSnackBar(err.message, 'close');
  //       // this.alertModel.messages.push("image uploading error");
  //       // this.alertModel$.next(this.alertModel);
  //     })

  // }


  // removeMediaFiles() {
  //   // let persistingImages = this.persistCampaign.mediaFiles;
  //   this.editCampaignViewModel.toRemovePictures.forEach((imgNametoRemove, index1) => {

  //     this.persistCampaign.mediaFiles.forEach((image, index) => {

  //       if (image.name == imgNametoRemove) {
  //         this.persistCampaign.mediaFiles.splice(index, 1);
  //       }

  //     })
  //   });
  //   // let filesToRemovefromContainer = this.croppedImagesToDeleteFromPersistPosts.concat(this.editCampaignViewModel.toRemovePictures);
  //   // this.editCampaignViewModel.toRemovePictures.forEach((imageName, index) => {
  //   this.campaignService.removeMediaFilesfromContainer(this.editCampaignViewModel.toRemovePictures).subscribe(res => {
  //     // console.log(res); })
  //   })

  // }

  // checkMediaFilesChange(campaign): Observable<Array<any>> {   // removing files
  // from existing models client side   let mediaFiles$ = new
  // BehaviorSubject(this.persistCampaign.mediaFiles);   if
  // (this.editCampaignViewModel.toRemovePictures.length >= 1 ||
  // campaign.mediaFiles.length >= 1) {     if
  // (this.editCampaignViewModel.toRemovePictures.length >= 1) {
  // this.editCampaignViewModel.toRemovePictures.forEach(imgNametoRemove => {
  //    let count = 0;         this.persistCampaign.mediaFiles.forEach(image => {
  //           if (image.name == imgNametoRemove) {
  // this.persistCampaign.mediaFiles.splice(count, 1);           }
  // count++;         })       })     }     if (campaign.mediaFiles.length >= 1)
  // {       this.editCampaignViewModel.newMediaFiles = true;
  // mediaFiles$.next(this.persistCampaign.mediaFiles);     } else {
  // this.editCampaignViewModel.newMediaFiles = false;     }   } else {
  // mediaFiles$.next(this.persistCampaign.mediaFiles);   }   return mediaFiles$;
  // }
  // delteFromCroppedImages(file) {
  //   console.log(this.croppedImages);
  //   console.log(file);
  //   let cImagesNames: Array<string> = [];
  //   // this.croppedImages.forEach((cImage, index)=>{
  //   for (let i = 0; i < this.croppedImages.length; i++) {
  //     if (this.croppedImages[i].file.name.substring(this.croppedImages[i].file.name.indexOf('-') + 1) == file.name) {
  //       cImagesNames.push(this.croppedImages[i].file.name);
  //     }
  //   }

  //   cImagesNames.forEach((cImage, index) => {

  //     // var cimage = cImage.substring(cImage.indexOf('_')+1);
  //     let cIndex = this.croppedImages.findIndex(x => x.file.name == cImage);
  //     if (cIndex > -1) {
  //       this.croppedImages.splice(cIndex, 1);
  //     }


  //   })
  //   // })


  // }
  // onInputMediaRemoveFromDefinition = (file) => {
  //   // need to refactor
  //   this.onNewMediaRemoveFromDefinition(file)
  //   this.delteFromCroppedImages(file);

  //   // this.editCampaignViewModel.toRemovePictures.push(file.name);
  //   if (file.type == 'video/mp4') {
  //     let index = this.persistCampaign.mediaFiles.findIndex(x => x.originalFilename == file.originalFilename);
  //     if (index > -1) {
  //       this.editCampaignViewModel.toRemovePictures.push(this.persistCampaign.mediaFiles[index].name)
  //     }
  //   } else {
  //     let index = this.persistCampaign.mediaFiles.findIndex(x => x.originalFilename == file.name);
  //     if (index > -1) {
  //       this.editCampaignViewModel.toRemovePictures.push(this.persistCampaign.mediaFiles[index].name)
  //     }
  //   }

  //   this.editCampaignViewModel.toRemovePictures.push(file.thumbnail);
  //   // this.editCampaignViewModel.toRemovePictures.push(event);

  //   if (this.persistPostsArray.length >= 1) {
  //     this.persistPostsArray.forEach(post => {
  //       // event.forEach(imageName => {
  //       // console.log(string.substring(string.indexOf('_')+1))
  //       post.mediaFiles.forEach((x, index) => {
  //         // var thumbnailNameToDelete = x.name.substr(0, x.name.lastIndexOf('.')); // var
  //         // type = thumbnailNameToDelete.split('.').pop(); let deleteThumbnailIndex =
  //         // this.thumbnailArray.findIndex(x => x.name.substr(0, x.name.lastIndexOf('.'))
  //         // == thumbnailNameToDelete);

  //         if (x.isCropped) {

  //           if (x.originalFilename == file.name) {
  //             this.croppedImagesToDeleteFromPersistPosts.push(x.name);
  //             // this.editCampaignViewModel.toRemovePictures.push(post.mediaFiles[index].name)
  //             // this.editCampaignViewModel.toRemovePictures.push(x.name);
  //             post.mediaFiles.splice(index, 1);
  //           } else {
  //             let existingFilename = x.originalFilename.substring(x.originalFilename.indexOf('-') + 1)
  //             if (existingFilename == file.name) {
  //               // var thumbnailNameToDelete = x.name.substr(0, x.name.lastIndexOf('.'));
  //               this.croppedImagesToDeleteFromPersistPosts.push(x.name);
  //               // this.editCampaignViewModel.toRemovePictures.push(post.mediaFiles[index].name)
  //               post.mediaFiles.splice(index, 1);
  //               // _.remove(post.mediaFiles, { originalFilename: x.originalFilename });
  //             }
  //           }
  //         } else {
  //           if (file.type == 'video/mp4') {
  //             if (x.originalFilename == file.originalFilename) {
  //               // var thumbnailNameToDelete = x.name.substr(0, x.name.lastIndexOf('.'));
  //               // this.croppedImagesToDeleteFromPersistPosts.push(x.name);
  //               // this.editCampaignViewModel.toRemovePictures.push(post.mediaFiles[index].name)
  //               this.editCampaignViewModel.toRemovePictures.push(x.name);
  //               post.mediaFiles.splice(index, 1);
  //             }
  //           } else {

  //             if (x.originalFilename == file.name) {
  //               // var thumbnailNameToDelete = x.name.substr(0, x.name.lastIndexOf('.'));
  //               this.croppedImagesToDeleteFromPersistPosts.push(x.name);

  //               // this.editCampaignViewModel.toRemovePictures.push(x.name);
  //               post.mediaFiles.splice(index, 1);
  //             } else {
  //               let existingFilename = x.originalFilename.substring(x.originalFilename.indexOf('-') + 1)
  //               if (existingFilename == file.name) {
  //                 this.croppedImagesToDeleteFromPersistPosts.push(x.name);
  //                 // this.editCampaignViewModel.toRemovePictures.push(x.name)
  //                 post.mediaFiles.splice(index, 1);
  //               }
  //             }

  //           }

  //         }

  //       });

  //     })
  //   }
  //   // this.persistPostsArray$.next(this.persistPostsArray);
  //   console.log(this.editCampaignViewModel.toRemovePictures);
  // }

  // uploadingMediaFiles(mediaFiles): Observable<Array<any>> {

  //   return this.campaignService.uploadImage(mediaFiles).map(res => {

  //     return this.returnMediaFilesNames(mediaFiles, res);

  //   }, err => {
  //     this.openSnackBar(err.message, 'close');

  //   })

  // }

  // returnMediaFilesNames(mediaFiles, res) {
  //   let result1 = JSON.parse(res[0]._body);
  //   let files = _.map(result1.result.files.uploadFile, _.partialRight(_.pick, ['originalFilename', 'name', 'type']));
  //   mediaFiles.forEach(persistFiles => {
  //     let imageFoundIndex = files.findIndex(x => x.originalFilename == persistFiles.name);
  //     if (imageFoundIndex > -1) {
  //       // files[imageFoundIndex]={};
  //       files[imageFoundIndex]._tags = persistFiles.tags;
  //       files[imageFoundIndex].id = UUID.UUID();
  //       // files[imageFoundIndex].ori
  //     }
  //   })

  //   return files;
  // }


  // onNewAccountPageSelection(socialAccountsPageArray) {
  // this.newSelectedSocialAccountsArtifactsArray.push(socialAccountsPageArray) }


  // deleteFromNewAddedSocialArtifactsIfExist(socialAccountsPage) {
  //   // this.newSelectedSocialAccountsArtifactsArray = this.campaignNetworkService.onRemoveArtifact(socialAccountsPage, this.newSelectedSocialAccountsArtifactsArray);

  //   // if (this.newSelectedSocialAccountsArtifactsArray.length >= 1) {
  //   // this.newSelectedSocialAccountsArtifactsArray.forEach((element, index) => {
  //   //  if (element.socialAccountObj.id == socialAccountsPage.socialAccountObj.id
  //   // && element.pageObj.id == socialAccountsPage.pageObj.id) {
  //   // this.newSelectedSocialAccountsArtifactsArray.splice(index, 1)     }   }) }
  // }

  // deleteFromAllSelectedSocialArtifactsIfExist(socialAccountsArtifact) {
  //   if (this.selectedSocialAccountsArtifactsArray.length >= 1) {
  //     // this.selectedSocialAccountsArtifactsArray$.next(this.campaignNetworkService.onRemoveArtifact(socialAccountsArtifact, this.selectedSocialAccountsArtifactsArray));
  //     // this.selectedSocialAccountsArtifactsArray.forEach((element, index) => {   if
  //     // (element.socialAccountObj.id == socialAccountsArtifact.socialAccountObj.id
  //     // && element.pageObj.id == socialAccountsArtifact.pageObj.id) {
  //     // this.selectedSocialAccountsArtifactsArray.splice(index, 1);     //
  //     // this.selectedSocialAccountsArtifactsArray$.next(this.selectedSocialAccountsArt
  //     // ifactsArray);   } })
  //     // this.selectedSocialAccountsArtifactsArray$.next(this.selectedSocialAccountsArt
  //     // ifactsArray);
  //   }
  // }
  // saveCroppedImagestoUpload(base64CroppedImage) {
  //   const base64Data = base64CroppedImage.src;
  //   let cFile: File;
  //   fetch(base64Data)
  //     .then(res => res.blob())
  //     .then(blob => {
  //       let convertedFile = new File([blob], base64CroppedImage.name, { type: 'image/png' });
  //       let croppedImageObj: FileToUploadModel = {
  //         networkType: base64CroppedImage.type,
  //         file: convertedFile
  //       }
  //       let found = false;
  //       if (this.croppedImages.length >= 1) {
  //         this.croppedImages.forEach((cImage, index) => {
  //           var croppedIndex = cImage.file.name.indexOf('-');
  //           var newCroppedIndex = croppedImageObj.file.name.indexOf('-');
  //           let incomingCroppedImageName = croppedImageObj.file.name.substring(newCroppedIndex + 1, croppedImageObj.file.name.length);
  //           let CroppedImageName = cImage.file.name.substring(croppedIndex + 1, cImage.file.name.length);
  //           if (incomingCroppedImageName == CroppedImageName) {
  //             if (croppedImageObj.networkType == cImage.networkType || croppedImageObj.networkType == 'All') {
  //               this.croppedImages.splice(index, 1);
  //               this.croppedImages.push(croppedImageObj);
  //             }
  //             // else {
  //             //   this.croppedImages.push(croppedImageObj);
  //             // }
  //           }
  //           // else {
  //           //   this.croppedImages.push(croppedImageObj);
  //           // }
  //         })
  //         if (!found) {
  //           this.croppedImages.push(croppedImageObj);
  //         }

  //       } else {
  //         this.croppedImages.push(croppedImageObj);
  //       }

  //       // this.emitCroppedImages.emit(this.croppedImagesToUpload);
  //     })
  // }
  // onNewImageCropped(base64CroppedImage) {
  //   this.processNewCroppedImageToShow(base64CroppedImage)
  //   this.saveCroppedImagestoUpload(base64CroppedImage);
  // }
  // onInputImageCropped(base64CroppedImage) {
  //   this.processInputCroppedImageToShow(base64CroppedImage)
  //   this.saveCroppedImagestoUpload(base64CroppedImage);
  //   // this.croppedImages = croppedImages;

  //   console.log("container images cropped", this.croppedImages);
  // }



  // checkIfAnyArtifactSelected() {
  //   if (this.selectedSocialAccountsArtifactsArray.length >= 1) {
  //     this.isAccountSelected = true;
  //   } else {
  //     this.isAccountSelected = false;
  //   }
  // }

  // makePostObject = (createdCampaign: Campaign) => {
  //   this.newSelectedSocialAccountsArtifactsArray.forEach(element => {

  //     // let mediaFilesForPost = [...createdCampaign.mediaFiles]
  //     // mediaFilesForPost.forEach(image => {   image.parentId = image.name; })

  //     let postObj: Post = {
  //       scheduleDate: createdCampaign.scheduledAt,
  //       socialMediaAccountId: element.socialAccountObj.id,
  //       network: element.socialAccountObj.type,
  //       mediaFiles: [...createdCampaign.mediaFiles],
  //       socialMediaInfo: element.pageObj,
  //       registerUserId: this.profileStore.userId,
  //       // campaignId:createdCampaign.id
  //     }
  //     this.postsArray.push(postObj);

  //   })
  //   console.log("post array", this.postsArray);
  // }
  // createPostsForEachSocialAccount = (createdCampaign) => {
  //   // this.profileStore.loaderStart(); this.makePostObject(createdCampaign);

  //   return this.campaignService.createPosts(this.postsArray, createdCampaign).map(res => {
  //     // console.log(res);
  //     this.newSelectedSocialAccountsArtifactsArray = [];
  //     return;
  //   }, err => {
  //     console.log(err);
  //     this.openSnackBar(err.message, 'close');
  //     return err;
  //   })

  // }



  // uploadThumbnails = (thumbnails, files) => {

  //   return this.campaignService.uploadImage(thumbnails).map(uploadedThumbnails => {
  //     // files.forEach(mediaFile=>{ if(mediaFile.name==res) })cons

  //     return this.updatemediaFilesWiththumbnails(uploadedThumbnails, files)
  //   })
  // }

  // getMessage = () => {
  //    ;
  //   this.socket.on("message", (data) => {
  //     if (data && data.id === this.editCampaignViewModel.id) {
  //       this.campaignStore.addCampaignCommnets(data);
  //       this.campaignComments$.next(this.campaignStore.campaignComments);
  //     }

  // getThumbnailArray = (ThumbnailArray) => {
  //   this.allThumbnails = [...ThumbnailArray];
  //   console.log(this.allThumbnails);
  // }


  // posts images in tiles code start
  // processCroppedImageToShow = (base64CroppedImage) => {
  //   this.fillPostsToShowCroppedImages(base64CroppedImage)
  //   // if (this.editCampaignViewModel.croppedImagesToShow.length >= 1) {
  //   //   let found = this.editCampaignViewModel.croppedImagesToShow.find(x => x.name == base64CroppedImage.name);
  //   //   if (found) {
  //   //     this.replacePostsToShowCroppedImages(base64CroppedImage);
  //   //   } else {
  //   //     this.editCampaignViewModel.croppedImagesToShow.push(base64CroppedImage);
  //   //     console.log("cropped images to show", this.editCampaignViewModel.croppedImagesToShow);

  //   //     this.fillPostsToShowCroppedImages(base64CroppedImage)
  //   //   }
  //   // } else {
  //   //   this.editCampaignViewModel.croppedImagesToShow.push(base64CroppedImage);
  //   //   console.log("cropped images to show", this.editCampaignViewModel.croppedImagesToShow);

  //   //   this.fillPostsToShowCroppedImages(base64CroppedImage)
  //   // }
  // }

  // makePostOnSocialArtifactSelection = (selectedArtifact) => {

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

  //   this.assignMediaFilesToRelativePost(postObj);

  //   console.log("post array on network page selection", this.editCampaignViewModel.postsArrayToShow);
  // }
  // assignMediaFilesToRelativePost = (newPostObj) => {
  //   let mediaFilesAssigned = false;
  //   this.editCampaignViewModel.postsArrayToShow.forEach(post => {
  //     if (post.network == newPostObj.network) {
  //       newPostObj.mediaFiles = post.mediaFiles.map(x => Object.assign({}, x));
  //       mediaFilesAssigned = true;
  //     }
  //   })

  //   if (!mediaFilesAssigned) {
  //     if (this.persistCampaign.status == 'Posted' || this.persistCampaign.status == 'Canceled') {
  //       newPostObj.mediaFiles = this.editCampaignViewModel.originalFilesToShow;
  //     } else {
  //       newPostObj.mediaFiles = this.persistCampaign.mediaFiles.map(x => Object.assign({}, x));
  //     }

  //   }

  //   this.editCampaignViewModel.postsArrayToShow.push(newPostObj);
  //   this.fillPostsToShowWithOriginalImages();
  //   this.editCampaignViewModel.postsArrayToShow$.next(this.editCampaignViewModel.postsArrayToShow);
  // }

  // onNewMediaSelectionFromDefinition = (newSelectedBase64File) => {
  //   this.editCampaignViewModel.originalFilesToShow.push(newSelectedBase64File);
  //   console.log("original files to show ", this.editCampaignViewModel.originalFilesToShow);
  //   this.fillPostsToShowWithOriginalImages();
  // }


  // fillCampaignAndPostWithCroppedImage(incomingCroppedfile: MediaFileAssetViewModel) {
  //   this.campaignViewModel.mediaFiles.forEach((file, index) => {
  //     if (incomingCroppedfile.name == file.name || incomingCroppedfile.name == file.originalFilename) {
  //       if (file.croppedImages.length >= 1) {
  //         let find = file.croppedImages.findIndex(x => x.name == incomingCroppedfile.name && (x.network == incomingCroppedfile.network || incomingCroppedfile.network == 'All'))
  //         if (find == -1) {
  //           find = file.croppedImages.findIndex(x => x.originalFilename == incomingCroppedfile.name && (x.network == incomingCroppedfile.network || incomingCroppedfile.network == 'All'))
  //         }
  //         if (find > -1) {
  //           if (file.croppedImages[find].id && file.croppedImages[find].id != '') {

  //             file.croppedImages[find].id = '';
  //           }
  //           file.croppedImages[find].file = incomingCroppedfile.file;
  //           file.croppedImages[find].base64File = incomingCroppedfile.base64File;
  //           file.croppedImages[find].name = incomingCroppedfile.name;
  //           // file.isCropped = true;
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
  //     // post.mediaFiles.forEach((file, index) => {
  //     // if (file.name == incomingCroppedfile.name && (incomingCroppedfile.network == post.network || incomingCroppedfile.network == 'All')) {
  //     let findIndex = post.mediaFiles.findIndex(x => x.name == incomingCroppedfile.name && (post.network == incomingCroppedfile.network || incomingCroppedfile.network == 'All'))
  //     if (findIndex == -1) {
  //       findIndex = post.mediaFiles.findIndex(x => x.originalFilename == incomingCroppedfile.name && (post.network == incomingCroppedfile.network || incomingCroppedfile.network == 'All'))
  //     }
  //     if (findIndex > -1) {
  //       if (post.mediaFiles[findIndex].id && post.mediaFiles[findIndex].isCropped) {
  //         this.campaignViewModel.deletedPersistantImages.push(post.mediaFiles[findIndex].name);
  //         post.mediaFiles[findIndex].id = '';

  //       }
  //       post.mediaFiles[findIndex].base64File = incomingCroppedfile.base64File;
  //       post.mediaFiles[findIndex].file = incomingCroppedfile.file;
  //       post.mediaFiles[findIndex].isCropped = true;
  //       post.mediaFiles[findIndex].network = post.network;
  //       this.postsArrayToShow$.next(this.campaignViewModel.posts);
  //     }
  //     // })
  //   })
  // }



  // fillPostsToShowWithOriginalImages() {
  //   if (this.editCampaignViewModel.postsArrayToShow.length >= 1) {
  //     this.editCampaignViewModel.postsArrayToShow.forEach(post => {
  //       this.editCampaignViewModel.originalFilesToShow.forEach(oFile => {
  //         if (oFile.type == 'video/mp4') {
  //           post.mediaFiles.push(oFile.thumnbnail);
  //         } else {
  //           let found = post.mediaFiles.find(x => x.name == oFile.name)
  //           if (found) { } else {
  //             post.mediaFiles.push(oFile);
  //           }
  //         }
  //       })
  //     });
  //   }
  // }

  // getbase64CroppedImage(croppedImage) {
  //   if (this.editCampaignViewModel.croppedImagesToShow.length >= 1) {
  //     let found = this.editCampaignViewModel.croppedImagesToShow.find(x => x.name == croppedImage.name);
  //     if (found) {
  //       this.replacePostsToShowCroppedImages(croppedImage);
  //     } else {
  //       this.editCampaignViewModel.croppedImagesToShow.push(croppedImage);
  //       console.log("cropped images to show", this.editCampaignViewModel.croppedImagesToShow);

  //       this.fillPostsToShowCroppedImages()
  //     }
  //   } else {
  //     this.editCampaignViewModel.croppedImagesToShow.push(croppedImage);
  //     console.log("cropped images to show", this.editCampaignViewModel.croppedImagesToShow);

  //     this.fillPostsToShowCroppedImages()
  //   }

  // }
  // processNewCroppedImageToShow(newCroppedImage) {
  //   // this.croppedImagesToShow.forEach(cImages => {
  //   // console.log(this.persistPostsArray);
  //   // console.log(this.persistCampaign.posts);
  //   for (let i = 0; i < this.editCampaignViewModel.postsArrayToShow.length; i++) {
  //     // this.editCampaignViewModel.croppedImagesToShow.forEach(cImages => {
  //     // console.log(files);
  //     if (this.editCampaignViewModel.postsArrayToShow[i].network == newCroppedImage.type || newCroppedImage.type == 'All') {
  //       let imageFound = -1
  //       if (newCroppedImage.type == 'All') {
  //         imageFound = this.editCampaignViewModel.postsArrayToShow[i].mediaFiles
  //           .findIndex(y => 'All-' + y.name == newCroppedImage.name)
  //       }
  //       if (imageFound == -1) {
  //         var name = newCroppedImage.name.indexOf('-');
  //         imageFound = this.editCampaignViewModel.postsArrayToShow[i].mediaFiles.findIndex(y => y.name == 'All-' + newCroppedImage.name.substring(name + 1, newCroppedImage.name.length))
  //       }

  //       if (imageFound == -1) {
  //         imageFound = this.editCampaignViewModel.postsArrayToShow[i].mediaFiles.findIndex(y => newCroppedImage.type + '-' + y.name == newCroppedImage.name)
  //       }
  //       if (imageFound == -1) {
  //         imageFound = this.editCampaignViewModel.postsArrayToShow[i].mediaFiles.findIndex(y => y.name == newCroppedImage.name)
  //       }

  //       if (imageFound == -1) {
  //         var name = newCroppedImage.name.indexOf('-');
  //         console.log("cropped name without network", newCroppedImage.name.substring(name + 1, newCroppedImage.name.length));

  //         imageFound = this.editCampaignViewModel.postsArrayToShow[i].mediaFiles.findIndex(y => y.name == this.editCampaignViewModel.postsArrayToShow[i].network + '-' + newCroppedImage.name.substring(name + 1, newCroppedImage.name.length))
  //       }

  //       if (imageFound > -1) {
  //         // let tags = this.postsArrayToShow[i].mediaFiles[imageFound].tags; let
  //         // thumbnail = this.postsArrayToShow[i].mediaFiles[imageFound].thumbnail; var
  //         // name = cImages.name.indexOf('-'); console.log("cropped name without network",
  //         // cImages.name.substring(name + 1, cImages.name.length));
  //         this.editCampaignViewModel.postsArrayToShow[i].mediaFiles[imageFound] = {};
  //         this.editCampaignViewModel.postsArrayToShow[i].mediaFiles[imageFound].name = newCroppedImage.name;
  //         this.editCampaignViewModel.postsArrayToShow[i].mediaFiles[imageFound].src = newCroppedImage.src;
  //         this.editCampaignViewModel.postsArrayToShow[i].mediaFiles[imageFound].type = 'image';
  //         // if (tags) {   this.postsArrayToShow[i].mediaFiles[imageFound].tags = tags; }
  //         this.editCampaignViewModel.postsArrayToShow[i].mediaFiles[imageFound].network = newCroppedImage.type;
  //         // this.postsArrayToShow[i].mediaFiles[imageFound].originalFilename =
  //         // cImages.file.name; this.postsArrayToShow[i].mediaFiles[imageFound].isCropped
  //         // = true; this.postsArrayToShow[i].error = "changes"; imageFound.parentId
  //         // =cImages.parentId;
  //       }
  //     }

  //     // });
  //   }
  //   this.editCampaignViewModel.postsArrayToShow$.next(this.editCampaignViewModel.postsArrayToShow);
  // }
  // processInputCroppedImageToShow = (cImages) => {
  //   // this.croppedImagesToShow.forEach(cImages => {
  //   // console.log(this.persistPostsArray);
  //   // console.log(this.persistCampaign.posts);
  //   for (let i = 0; i < this.editCampaignViewModel.postsArrayToShow.length; i++) {
  //     // this.editCampaignViewModel.croppedImagesToShow.forEach(cImages => {
  //     // console.log(files);
  //     if (this.editCampaignViewModel.postsArrayToShow[i].network == cImages.type || cImages.type == 'All') {
  //       let imageFound = -1
  //       if (cImages.type == 'All') {
  //         imageFound = this.editCampaignViewModel.postsArrayToShow[i].mediaFiles.findIndex(y => 'All-' + y.originalFilename == cImages.name)
  //       }
  //       if (imageFound == -1) {
  //         var name = cImages.name.indexOf('-');
  //         console.log(cImages.name.substring(name + 1, cImages.name.length))
  //         imageFound = this.editCampaignViewModel.postsArrayToShow[i].mediaFiles.findIndex(y => y.originalFilename == 'All-' + cImages.name.substring(name + 1, cImages.name.length))
  //       }

  //       if (imageFound == -1) {
  //         imageFound = this.editCampaignViewModel.postsArrayToShow[i].mediaFiles.findIndex(y => cImages.type + '-' + y.originalFilename == cImages.name)
  //       }
  //       if (imageFound == -1) {
  //         imageFound = this.editCampaignViewModel.postsArrayToShow[i].mediaFiles.findIndex(y => y.originalFilename == cImages.name)
  //       }


  //       if (imageFound == -1) {
  //         var name = cImages.name.indexOf('-');
  //         console.log("cropped name without network", cImages.name.substring(name + 1, cImages.name.length));

  //         imageFound = this.editCampaignViewModel.postsArrayToShow[i].mediaFiles.findIndex(y => y.originalFilename == this.editCampaignViewModel.postsArrayToShow[i].network + '-' + cImages.name.substring(name + 1, cImages.name.length))
  //       }

  //       if (cImages.type == 'All' && imageFound == -1) {
  //         imageFound = this.editCampaignViewModel.postsArrayToShow[i].mediaFiles.findIndex(y => 'All-' + y.name == cImages.name)
  //       }
  //       if (imageFound == -1) {
  //         var name = cImages.name.indexOf('-');
  //         imageFound = this.editCampaignViewModel.postsArrayToShow[i].mediaFiles.findIndex(y => y.name == 'All-' + cImages.name.substring(name + 1, cImages.name.length))
  //       }

  //       if (imageFound == -1) {
  //         imageFound = this.editCampaignViewModel.postsArrayToShow[i].mediaFiles.findIndex(y => cImages.type + '-' + y.name == cImages.name)
  //       }
  //       if (imageFound == -1) {
  //         imageFound = this.editCampaignViewModel.postsArrayToShow[i].mediaFiles.findIndex(y => y.name == cImages.name)
  //       }

  //       if (imageFound == -1) {
  //         var name = cImages.name.indexOf('-');
  //         console.log("cropped name without network", cImages.name.substring(name + 1, cImages.name.length));

  //         imageFound = this.editCampaignViewModel.postsArrayToShow[i].mediaFiles.findIndex(y => y.name == this.editCampaignViewModel.postsArrayToShow[i].network + '-' + cImages.name.substring(name + 1, cImages.name.length))
  //       }


  //       if (imageFound > -1) {
  //         // let tags = this.postsArrayToShow[i].mediaFiles[imageFound].tags; let
  //         // thumbnail = this.postsArrayToShow[i].mediaFiles[imageFound].thumbnail; var
  //         // name = cImages.name.indexOf('-'); console.log("cropped name without network",
  //         // cImages.name.substring(name + 1, cImages.name.length));
  //         this.editCampaignViewModel.postsArrayToShow[i].mediaFiles[imageFound] = {};
  //         this.editCampaignViewModel.postsArrayToShow[i].mediaFiles[imageFound].name = cImages.name;
  //         this.editCampaignViewModel.postsArrayToShow[i].mediaFiles[imageFound].src = cImages.src;
  //         this.editCampaignViewModel.postsArrayToShow[i].mediaFiles[imageFound].type = 'image';
  //         // if (tags) {   this.postsArrayToShow[i].mediaFiles[imageFound].tags = tags; }
  //         this.editCampaignViewModel.postsArrayToShow[i].mediaFiles[imageFound].network = cImages.type;
  //         // this.postsArrayToShow[i].mediaFiles[imageFound].originalFilename =
  //         // cImages.file.name; this.postsArrayToShow[i].mediaFiles[imageFound].isCropped
  //         // = true; this.postsArrayToShow[i].error = "changes"; imageFound.parentId
  //         // =cImages.parentId;
  //       }
  //     }
  //     // });
  //   }
  //   this
  //     .editCampaignViewModel
  //     .postsArrayToShow$
  //     .next(this.editCampaignViewModel.postsArrayToShow);
  //   // });

  // }

  // replacePostsToShowCroppedImages = (croppedImage) => {
  //   for (let i = 0; i < this.editCampaignViewModel.postsArrayToShow.length; i++) {

  //     // console.log(files);
  //     if (this.editCampaignViewModel.postsArrayToShow[i].network == croppedImage.type || croppedImage.type == 'All') {
  //       let imageFound = -1;
  //       if (croppedImage.type == 'All') {
  //         imageFound = this.editCampaignViewModel.postsArrayToShow[i].mediaFiles
  //           .findIndex(y => 'All-' + y.name == croppedImage.name)
  //       }
  //       if (croppedImage.type == 'All' && imageFound == -1) {
  //         var name = croppedImage.name.indexOf('-');
  //         imageFound = this.editCampaignViewModel.postsArrayToShow[i].mediaFiles
  //           .findIndex(y => y.name == this.editCampaignViewModel.postsArrayToShow[i].network + '-' + croppedImage.name.substring(name + 1, croppedImage.name.length))
  //       }
  //       imageFound = this.editCampaignViewModel.postsArrayToShow[i].mediaFiles.findIndex(y => croppedImage.type + '-' + y.originalFilename == croppedImage.name)

  //       if (imageFound == -1) {
  //         imageFound = this.editCampaignViewModel.postsArrayToShow[i].mediaFiles.findIndex(y => croppedImage.type + '-' + y.name == croppedImage.name)
  //       }
  //       if (imageFound == -1) {
  //         imageFound = this.editCampaignViewModel.postsArrayToShow[i].mediaFiles.findIndex(y => y.name == croppedImage.name)
  //       }
  //       if (imageFound == -1) {
  //         var name = croppedImage.name.indexOf('-');
  //         console.log("cropped name without network", croppedImage.name.substring(name + 1, croppedImage.name.length));
  //         imageFound = this.editCampaignViewModel.postsArrayToShow[i].mediaFiles.findIndex(y => y.name == this.editCampaignViewModel.postsArrayToShow[i].network + '-' + croppedImage.name.substring(name + 1, croppedImage.name.length));
  //       }

  //       if (imageFound > -1) {

  //         // var name = croppedImage.name.indexOf('-'); console.log("cropped name without
  //         // network", croppedImage.name.substring(name + 1, croppedImage.name.length));
  //         this.editCampaignViewModel.postsArrayToShow[i].mediaFiles[imageFound] = {};
  //         this.editCampaignViewModel.postsArrayToShow[i].mediaFiles[imageFound].name = croppedImage.name;
  //         this.editCampaignViewModel.postsArrayToShow[i].mediaFiles[imageFound].src = croppedImage.src;
  //         this.editCampaignViewModel.postsArrayToShow[i].mediaFiles[imageFound].type = 'image';
  //         this.editCampaignViewModel.postsArrayToShow[i].mediaFiles[imageFound].network = croppedImage.type;
  //       }
  //     }
  //   }

  //   this.editCampaignViewModel.postsArrayToShow$.next(this.editCampaignViewModel.postsArrayToShow);
  // }

  // onNewMediaRemoveFromDefinition = (file) => {
  //   this.delteFromCroppedImages(file);
  //   console.log(file.name);

  //   this.editCampaignViewModel.postsArrayToShow.forEach(post => {
  //     let index = -1;
  //     index = post.mediaFiles.findIndex(x => x.name == file.name);
  //     if (index == -1) {
  //       index = post.mediaFiles.findIndex(x => x.originalFilename == file.name);
  //     }
  //     if (index == -1) {
  //       index = post.mediaFiles.findIndex(x => x.originalFilename == post.network + '-' + file.name);
  //     }
  //     if (index == -1) {
  //       index = post.mediaFiles.findIndex(x => x.originalFilename == 'All-' + file.name);
  //     }
  //     if (index == -1) {
  //       index = post.mediaFiles.findIndex(x => x.name == 'All-' + file.name);
  //     }
  //     if (index == -1) {
  //       index = post.mediaFiles.findIndex(x => x.name == post.network + '-' + file.name);
  //     }
  //     // if (index == -1) {

  //     //   index = post.mediaFiles.findIndex(y => y.originalFilename == post.network+'-'+file.name)
  //     // }
  //     if (index > -1) {
  //       post.mediaFiles.splice(index, 1);
  //     }
  //     // delete from cropped

  //     // _.remove(this.editCampaignViewModel.croppedImagesToShow, function (e) {
  //     //   return e.originalFilename == post.network + '-' + file.name;
  //     // });
  //     // _.remove(this.editCampaignViewModel.croppedImagesToShow, function (e) {
  //     //   return e.originalFilename == 'All-' + file.name;
  //     // });
  //   })
  //   this.editCampaignViewModel.postsArrayToShow$.next(this.editCampaignViewModel.postsArrayToShow);
  //   // delete from original
  //   _.remove(this.editCampaignViewModel.originalFilesToShow, function (e) {
  //     return e.originalFilename == file.name;
  //   });
  //   _.remove(this.editCampaignViewModel.originalFilesToShow, function (e) {
  //     return e.name == file.name;
  //   });
  //   console.log("ori after delete", this.editCampaignViewModel.originalFilesToShow);

  //   console.log("cropped after delete", this.editCampaignViewModel.croppedImagesToShow);

  // }
  // emptyPostsToShow = () => {
  //   this.editCampaignViewModel.originalFilesToShow = [];
  //   this.editCampaignViewModel.croppedImagesToShow = [];
  //   this.editCampaignViewModel.postsArrayToShow = [];
  //   this.editCampaignViewModel.postsArrayToShow$.next(this.editCampaignViewModel.postsArrayToShow);
  // }


  //   this.editCampaignViewModel.postsArrayToShow.forEach((post, index) => {
  //     let found = false;
  //     if (socialAccountsArtifact.socialAccountObj.id == post.socialMediaAccountId && socialAccountsArtifact.pageObj.id == post.socialMediaInfo.id) {
  //       this.editCampaignViewModel.postsArrayToShow.splice(index, 1);
  //       this.editCampaignViewModel.postsArrayToShow$.next(this.editCampaignViewModel.postsArrayToShow);
  //     }
  //   })
  //   console.log(this.editCampaignViewModel.postsArrayToShow);
  // }
  // deleteCroppedImagesfromDeletedPost(postMediaFiles: Array<MediaFileAssetViewModel>) {
  //   let findCroppedImages = postMediaFiles.filter(x => x.isCropped == true && (x.id && x.id != ''));
  //   if (findCroppedImages) {
  //     findCroppedImages.forEach(CImage => {
  //       this.campaignViewModel.deletedPersistantImages.push(CImage.name);
  //     })
  //   }
  // }
}
