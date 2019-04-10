import { Injectable } from "@angular/core";
import { Campaign, Post, MediaFileAsset } from "../../../shared/sdk";
import { UserProfile } from "../../../store/user-profile";
import { CampaignService } from "./campaign.service";
// import { Socket } from 'net';
import * as _ from "lodash";
// import { flatMap } from 'lodash/flatMap';
import { CampaignViewModel } from "../models/campaignViewModel";
import { MatSnackBar } from "@angular/material";
import { UUID } from "angular2-uuid";
import { MediaFileAssetViewModel } from "../models/mediaFileAssetViewModel";
import { checkAndUpdateBinding } from "@angular/core/src/view/util";
// import { FileToUploadModel } from '../components/campaign-definition/model/fileToUploadModel';
import { Observable, empty, observable } from "rxjs";
import "rxjs/add/operator/mergeMap";
import { EmptyObservable } from "rxjs/observable/EmptyObservable";
import { positionElements } from "positioning";
import { Socket } from "ng-socket-io";
import { MediaAssetConversionUtil } from "./../../../shared/mediaAssetUtil/mediaAssetConversionUtil";
// import { PostViewModel } from '../../../shared/model/post-view.model';
import { PostViewModel } from "../models/postViewModel";
import { SocialAccountForCreate } from "../components/my-attached-social-networks/model/social-account-for-create.model";
import { find } from "rxjs/operators";
// import { Promise } from 'q';

@Injectable({
  providedIn: "root"
})
export class CampaignContainerService {
  imagePath: string;
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }

  constructor(
    public mediaAssetConversionUtil: MediaAssetConversionUtil,
    public snackBar: MatSnackBar,
    public profileStore: UserProfile,
    public campaignService: CampaignService,
    public socket: Socket
  ) {
    this.imagePath = require("./../../../shared/config/urls.json").IMAGE_DOWNLOAD_END_POINT_URL;
  }

  createCampaign(campaignVM: CampaignViewModel) {
    let campaign: Campaign = campaignVM.toServerModelWithoutMediaFiles();
    // campaign.state='Canceled';
    let imageFilesResult: Array<any> = null;
    let croppedImageFilesResult: Array<any> = null;
    let postsArray: Array<Post> = [];
    let UploadedServerFiles: Array<MediaFileAsset> = [];
    let uploadedFilesWithThumbnails: Array<MediaFileAsset> = [];
    let thumbnails = [];
    let croppedImages = [];

    if (campaignVM.mediaFiles) {
      croppedImages = _.flatMap(campaignVM.mediaFiles, x => x.croppedImages);
      thumbnails = campaignVM.mediaFiles.map(x => x.thumbnailFile.file);
    }

    return this.campaignService
      .createCampaign(campaign)
      .flatMap(campaignRes => {
        campaign = campaignRes;
        this.socket.emit("new create campaign", campaign.id);
        if (campaignVM.mediaFiles.length >= 1) {
          return this.campaignService.uploadImageNew(campaignVM.mediaFiles);
        } else {
          return Observable.of([]);
        }
      })
      .flatMap((imageFilesRes: Array<MediaFileAsset>) => {
        imageFilesResult = [...imageFilesRes];
        if (imageFilesRes && imageFilesRes.length >= 1) {
          UploadedServerFiles = this.returnMediaFilesNames(
            campaignVM.mediaFiles,
            imageFilesResult
          );
          return this.campaignService.uploadImage(thumbnails);
          // return Observable.of([])
        } else {
          return Observable.of([]);
        }
      })
      .flatMap((uploadedThumbnails: Array<MediaFileAsset>) => {
        imageFilesResult = uploadedThumbnails;
        if (uploadedThumbnails && uploadedThumbnails.length >= 1) {
          uploadedFilesWithThumbnails = this.updatemediaFilesWiththumbnails(
            uploadedThumbnails,
            UploadedServerFiles
          );
        }
        return this.campaignService.updateCamapign(
          campaign.id,
          uploadedFilesWithThumbnails
        );
      })
      .flatMap((campaignRes: Campaign) => {
        campaign = campaignRes;
        if (campaign.mediaFiles.length > 0 && campaignVM.posts.length > 0) {
          postsArray = this.postsWithFiles(
            uploadedFilesWithThumbnails,
            campaignVM
          );
        } else if (campaignVM.posts) {
          campaignVM.posts.forEach(post => {
            let postForServer: Post = post.toServerModelWithoutFiles();
            postForServer.scheduleDate = campaignVM.scheduledAt;
            postForServer.state = campaignVM.state;
            postForServer.mediaFiles = [];
            postsArray.push(postForServer);
          });
        }
        if (croppedImages.length >= 1) {
          return this.campaignService.uploadCroppedImage(croppedImages);
        } else {
          return Observable.of([]);
        }
      })
      .flatMap((croppedImageFilesRes: Array<MediaFileAsset>) => {
        croppedImageFilesResult = croppedImageFilesRes;
        if (croppedImageFilesResult && postsArray.length > 0) {
          this.returnCroppedMediaFilesNames(
            croppedImageFilesResult,
            postsArray
          );
        }
        if (postsArray.length >= 1) {
          return this.campaignService.createPosts(postsArray, campaign);
        } else {
          return Observable.of(true);
        }
      })
      .map(
        (postRes: Array<Post>) => {
          return Observable.of(true);
        },
        err => {
          return Observable.of(err);
        }
      );
  }

  updateCampaign(campaignVM: CampaignViewModel) {
    let campaign: Campaign = campaignVM.toServerModelWithoutMediaFiles();
    // campaign.mediaFiles = [];
    let imageFilesResult: Array<any> = null;
    let mediaFilesToUpload: Array<MediaFileAssetViewModel> = [];
    let croppedImageFilesResult: Array<any> = null;
    let thumbnails = [];
    let persistPostArray: Array<Post> = [];
    let newPostsArray: Array<Post> = [];
    let UploadedServerFiles: Array<MediaFileAsset> = [];
    let uploadedFilesWithThumbnails: Array<MediaFileAsset> = [];
    let allPostToUpdateMediaFiles: Array<Post> = [];
    let croppedImages = [];

    this.toDeleteCroppedImagesFromDeletedPosts(campaignVM);

    if (campaignVM.mediaFiles) {
      campaignVM.mediaFiles.forEach(file => {
        if (!file.id || file.id == "") {
          thumbnails.push(file.thumbnailFile.file);
          mediaFilesToUpload.push(file);
        } else {
          campaign.mediaFiles.push(file.toServerModel());
        }
      });
    }
    campaignVM.mediaFiles.forEach(checkImage => {
      if (checkImage.croppedImages.length >= 1) {
        checkImage.croppedImages.forEach(x => {
          if (x.id && x.id != "") {
          } else {
            croppedImages.push(x);
          }
        });
      }
    });

    return this.campaignService
      .removeMediaFilesfromContainer(campaignVM.deletedPersistantImages)
      .flatMap(deletedFiles => {
        if (mediaFilesToUpload.length >= 1) {
          return this.campaignService.uploadImageNew(mediaFilesToUpload);
        } else {
          return Observable.of([]);
        }
      })
      .flatMap((imageFilesRes: Array<MediaFileAsset>) => {
        imageFilesResult = [...imageFilesRes];
        if (imageFilesRes && imageFilesRes.length >= 1) {
          UploadedServerFiles = this.returnMediaFilesNames(
            mediaFilesToUpload,
            imageFilesResult
          );
          return this.campaignService.uploadImage(thumbnails);
        } else {
          return Observable.of([]);
        }
      })
      .flatMap((uploadedThumbnails: Array<MediaFileAsset>) => {
        imageFilesResult = uploadedThumbnails;
        if (uploadedThumbnails && uploadedThumbnails.length >= 1) {
          uploadedFilesWithThumbnails = this.updatemediaFilesWiththumbnails(
            uploadedThumbnails,
            UploadedServerFiles
          );
          campaign.mediaFiles = campaign.mediaFiles.concat(
            uploadedFilesWithThumbnails
          );
        }
        return this.campaignService.editCampaign(campaign.id, campaign);
      })
      .flatMap((editedCampaign: Campaign) => {
        campaign = editedCampaign;
        if (campaignVM.posts.length >= 1) {
          let persistAndNewPosts = this.replaceImagesPostsEditCase(
            campaign,
            campaignVM,
            uploadedFilesWithThumbnails
          );
          persistPostArray = [...persistAndNewPosts.persistPostArray];
          newPostsArray = [...persistAndNewPosts.newPostsArray];
          allPostToUpdateMediaFiles = persistPostArray.concat(newPostsArray);
        }
        if (croppedImages.length >= 1) {
          return this.campaignService.uploadCroppedImage(croppedImages);
        } else {
          return Observable.of([]);
        }
      })
      .flatMap((uploadedCroppedImages: Array<MediaFileAsset>) => {
        croppedImageFilesResult = uploadedCroppedImages;
        if (croppedImageFilesResult && allPostToUpdateMediaFiles.length > 0) {
          this.returnCroppedMediaFilesNames(
            croppedImageFilesResult,
            allPostToUpdateMediaFiles
          );
        }
        if (persistPostArray.length >= 1) {
          return this.campaignService.updatePosts(persistPostArray);
        } else {
          return Observable.of(null);
        }
      })
      .flatMap((updatedPost: Array<Post>) => {
        if (newPostsArray.length >= 1) {
          return this.campaignService.createPosts(newPostsArray, campaign);
        } else {
          return Observable.of(null);
        }
      })
      .flatMap((createdPosts: Array<Post>) => {
        if (campaignVM.postsToDelete.length >= 1) {
          let postsIds = _.map(campaignVM.postsToDelete, "id");
          return this.campaignService.removePosts(postsIds);
        } else {
          return Observable.of(null);
        }
      })
      .map(
        (result: any) => {
          return Observable.of(true);
        },
        err => {
          return Observable.of(err);
        }
      );
  }
  toDeleteCroppedImagesFromDeletedPosts(campaignVM: CampaignViewModel) {
    if (campaignVM.postsToDelete.length > 0) {
      campaignVM.postsToDelete.forEach(post => {
        let imageToDelete = post.mediaFiles.find(
          x => x.isCropped == true && x.id && x.id != ""
        );
        if (imageToDelete) {
          let imageFoundInOtherPost = _.find(
            campaignVM.posts,
            _.flow(
              _.property("mediaFiles"),
              _.partialRight(_.some, {
                name: imageToDelete.name,
                isCropped: true
              })
            )
          );
          if (!imageFoundInOtherPost) {
            campaignVM.deletedPersistantImages.push(imageToDelete.name);
          }
        }
      });
    }
  }
  replaceImagesPostsEditCase(
    campaign,
    campaignVM,
    uploadedFilesWithThumbnails
  ) {
    let persistPostArray: Array<Post> = [];
    let newPostsArray: Array<Post> = [];
    let persistAndNewPosts: any;
    campaignVM.posts.forEach((post: PostViewModel) => {
      let postForServer: Post = new Post();
      postForServer = post.toServerModelWithoutFiles();
      postForServer.scheduleDate = campaign.scheduledAt;
      postForServer.state = campaign.state;
      if (post.id && post.id != "") {
        if (uploadedFilesWithThumbnails.length >= 1) {
          uploadedFilesWithThumbnails.forEach(file => {
            if (
              ((postForServer.type == "video" ||
                postForServer.type == "multiple-videos") &&
                file.type == "video/mp4") ||
              ((postForServer.type == "image" ||
                postForServer.type == "multiple-images") &&
                file.type != "video/mp4")
            ) {
              postForServer.mediaFiles.push(Object.assign({}, file));
            }
          });
        }
        if (post.mediaFiles.length >= 1) {
          post.mediaFiles.forEach(file => {
            if (file.id && file.id != "") {
              if (
                ((postForServer.type == "video" ||
                  postForServer.type == "multiple-videos") &&
                  file.type == "video/mp4") ||
                ((postForServer.type == "image" ||
                  postForServer.type == "multiple-images") &&
                  file.type != "video/mp4")
              ) {
                postForServer.mediaFiles.push(
                  Object.assign({}, file.toServerModel())
                );
              }
            }
          });
        }
      } else {
        if (campaign.mediaFiles.length >= 1) {
          campaign.mediaFiles.forEach(file => {
            if (
              ((postForServer.type == "video" ||
                postForServer.type == "multiple-videos") &&
                file.type == "video/mp4") ||
              ((postForServer.type == "image" ||
                postForServer.type == "multiple-images") &&
                file.type != "video/mp4")
            ) {
              postForServer.mediaFiles.push(Object.assign({}, file));
            }
          });
        }
      }
      if (postForServer.id && postForServer.id != "") {
        persistPostArray.push(postForServer);
      } else {
        newPostsArray.push(postForServer);
      }
    });
    persistAndNewPosts = {
      persistPostArray: persistPostArray,
      newPostsArray: newPostsArray
    };
    return persistAndNewPosts;
  }
  changeCampaignType(campaign) {
    // let campaigntype = campaign;
    return campaign.mediaFiles.length == 0
      ? "text"
      : campaign.mediaFiles.length > 1
      ? "multiple-images"
      : campaign.mediaFiles.length == 1 &&
        campaign.mediaFiles[0].type == "video/mp4"
      ? "video"
      : campaign.mediaFiles.length == 1 &&
        (campaign.mediaFiles[0].type == "image/png" ||
          campaign.mediaFiles[0].type == "image/jpeg")
      ? "image"
      : "";
  }

  postsWithFiles(
    filesWiththumbnails: Array<MediaFileAsset>,
    campaignVM: CampaignViewModel
  ) {
    let postsArray: Array<Post> = [];
    campaignVM.posts.forEach(post => {
      let postForServer: Post = new Post();
      postForServer = post.toServerModelWithoutFiles();
      postForServer.scheduleDate = campaignVM.scheduledAt;
      postForServer.state = campaignVM.state;
      postForServer.mediaFiles = [];
      if (filesWiththumbnails.length >= 1) {
        filesWiththumbnails.forEach(file => {
          if (
            (file.type == "video/mp4" &&
              (postForServer.type == "video" ||
                postForServer.type == "multiple-videos")) ||
            (file.type != "video/mp4" &&
              (postForServer.type == "image" ||
                postForServer.type == "multiple-images"))
          )
            postForServer.mediaFiles.push(Object.assign({}, file));
        });
      }
      postsArray.push(postForServer);
    });
    return postsArray;
  }

  returnMediaFilesNames(mediaFiles, fileUploadRes) {
    let result1 = JSON.parse(fileUploadRes[0]._body);
    let files = _.map(
      result1.result.files.uploadFile,
      _.partialRight(_.pick, ["originalFilename", "name", "type"])
    );
    mediaFiles.forEach(persistFiles => {
      let imageFoundIndex = files.findIndex(
        x => x.originalFilename == persistFiles.file.name
      );
      if (imageFoundIndex > -1) {
        files[imageFoundIndex].tags = persistFiles.file.tags;
        files[imageFoundIndex].isCropped = false;
        files[imageFoundIndex].id = UUID.UUID();
      }
    });

    return files;
  }

  updatemediaFilesWiththumbnails(uploadedThumbnails, mediafiles) {
    let result1 = JSON.parse(uploadedThumbnails[0]._body);
    let files = _.map(
      result1.result.files.uploadFile,
      _.partialRight(_.pick, ["originalFilename", "name", "type"])
    );
    mediafiles.forEach(persistFiles => {
      let imageFoundIndex = files.findIndex(
        x =>
          x.originalFilename.substr(0, x.originalFilename.lastIndexOf(".")) ==
          persistFiles.originalFilename.substr(
            0,
            persistFiles.originalFilename.lastIndexOf(".")
          )
      );
      if (imageFoundIndex > -1) {
        persistFiles.thumbnail = files[imageFoundIndex].name;
      }
    });
    return mediafiles;
  }

  returnCroppedMediaFilesNames(uploadedImages, postArray: Array<Post>) {
    let imagesArray = [];
    uploadedImages.forEach(UPImage => {
      let result1 = JSON.parse(UPImage._body);
      imagesArray = imagesArray.concat(
        _.map(
          result1.data,
          _.partialRight(_.pick, [
            "originalFilename",
            "name",
            "type",
            "network"
          ])
        )
      );
    });
    imagesArray.forEach((image: MediaFileAsset) => {
      postArray.forEach((post, cIndex) => {
        let imageFound = post.mediaFiles.findIndex(
          x =>
            x.originalFilename == image.originalFilename &&
            (image.network == post.network || image.network == "All")
        );
        if (imageFound > -1) {
          post.mediaFiles[imageFound].name = image.name;
          post.mediaFiles[imageFound].network = image.network;
          post.mediaFiles[imageFound].isCropped = true;
          post.mediaFiles[imageFound].originalFilename = image.originalFilename;
        } else if (post.network == image.network) {
          let CImage = new MediaFileAsset();
          CImage.id = UUID.UUID();
          CImage.name = image.name;
          CImage.network = image.network;
          CImage.isCropped = true;
          CImage.originalFilename = image.originalFilename;
          if (post.type == "image" || post.type == "multiple-images") {
            post.mediaFiles.push(CImage);
          }
        }
      });
    });

    return imagesArray;
  }

  // common functins container

  onChangeDescription(
    description: string,
    campaignViewModel: CampaignViewModel
  ) {
    campaignViewModel.description = description;

    campaignViewModel.posts.forEach(post => {
      post.description = description;
    });

    return campaignViewModel;
  }
  removeMediaFileFromCampaignViewModel(
    incomingFile,
    campaignViewModel: CampaignViewModel
  ) {
    if (incomingFile.id != "" && incomingFile.id) {
      let findIndex = campaignViewModel.mediaFiles.findIndex(
        x => x.originalFilename == incomingFile.originalFilename
      );
      if (findIndex > -1) {
        campaignViewModel.mediaFiles.splice(findIndex, 1);
        campaignViewModel.deletedPersistantImages.push(incomingFile.name);
        campaignViewModel.deletedPersistantImages.push(
          incomingFile.thumbnailName
        );
      }
    } else {
      let findIndex = campaignViewModel.mediaFiles.findIndex(
        x => x.name == incomingFile.name
      );
      if (findIndex > -1) {
        campaignViewModel.mediaFiles.splice(findIndex, 1);
      }
    }
    return campaignViewModel;
  }

  setCampaignTypeRelatedtoMediaFiles(campaign: CampaignViewModel) {
    if (campaign.mediaFiles.length == 0) {
      campaign.type == "text";
    } else if (campaign.mediaFiles.length == 1) {
      campaign.type =
        campaign.mediaFiles[0].type == "vide/mp4" ? "video" : "image";
    } else if (campaign.mediaFiles.length > 1) {
      let ifImageExist = campaign.mediaFiles.find(x => x.type != "video/mp4");
      let ifVideoExist = campaign.mediaFiles.find(x => x.type == "video/mp4");
      if (ifImageExist && ifVideoExist) {
        campaign.type == "multiple-files";
      } else if (ifImageExist && !ifVideoExist) {
        campaign.type = "multiple-images";
      } else {
        campaign.type = "multiple-videos";
      }
    }
    return campaign.type;
  }
  removeMediaFileFromPost(incomingFile, campaignViewModel: CampaignViewModel) {
    campaignViewModel.posts.forEach((post, index) => {
      let findIndex = -1;
      if (incomingFile.id != "" && incomingFile.id) {
        findIndex = post.mediaFiles.findIndex(
          x => x.originalFilename == incomingFile.originalFilename
        );
        if (findIndex == -1) {
          findIndex = post.mediaFiles.findIndex(
            x => x.name == incomingFile.originalFilename
          );
        }
      } else {
        findIndex = post.mediaFiles.findIndex(x => x.name == incomingFile.name);
      }
      if (findIndex > -1) {
        if (
          post.mediaFiles[findIndex].isCropped &&
          post.mediaFiles[findIndex].id
        ) {
          campaignViewModel.deletedPersistantImages.push(
            post.mediaFiles[findIndex].name
          );
        }
        post.mediaFiles.splice(findIndex, 1);
        post.type = this.setPostTypeRelatedToMediaFile(post);
      }
    });

    return campaignViewModel;
  }

  setPostTypeRelatedToMediaFile(post) {
    if (post.mediaFiles.length > 1) {
      post.type =
        post.mediaFiles[0].type == "video/mp4"
          ? "multiple-videos"
          : "multiple-images";
    } else if (post.mediaFiles.length == 1) {
      post.type = post.mediaFiles[0].type == "video/mp4" ? "video" : "image";
    } else {
      post.type = "text";
    }
    return post.type;
  }

  addMediaFileInCampaign(
    newFile: MediaFileAssetViewModel,
    campaignViewModel: CampaignViewModel
  ) {
    let fileFound = campaignViewModel.mediaFiles.find(
      x => x.name == newFile.name
    );
    if (fileFound) {
      fileFound = Object.assign({}, newFile);
    } else {
      let file: MediaFileAssetViewModel = new MediaFileAssetViewModel();
      file.name = newFile.name;
      file.base64File = Object.assign({}, newFile.base64File);
      file.file = Object.assign({}, newFile.file);
      file.type = Object.assign({}, newFile.type);
      file.isCropped = false;
      if (newFile.thumbnailFile) {
        file.thumbnailFile.file = Object.assign({}, newFile.thumbnailFile.file);
        file.thumbnailFile.base64File = Object.assign(
          {},
          newFile.thumbnailFile.file
        );
      }
      campaignViewModel.mediaFiles.push(Object.assign({}, newFile));
      campaignViewModel.type = this.setCampaignTypeRelatedtoMediaFiles(
        campaignViewModel
      );
      // if (campaignViewModel.type == 'text') {
      //     campaignViewModel.type = (newFile.type == 'video/mp4' ? 'video' : newFile.type != 'video/mp4' ? 'image' : '')
      // }
      // else if (campaignViewModel.type == 'image' || campaignViewModel.type == 'multiple-images') {
      //     campaignViewModel.type = (newFile.type == 'video/mp4' ? 'multiple-files' : newFile.type != 'video/mp4' ? 'multiple-images' : '')
      // } else if (campaignViewModel.type == 'video' || campaignViewModel.type == 'multiple-videos') {
      //     campaignViewModel.type = (newFile.type == 'video/mp4' ? 'multiple-videos' : newFile.type != 'video/mp4' ? 'multi-file' : '');
      // }
    }
  }

  addMediaFileInToRelativePost(
    newFile: MediaFileAssetViewModel,
    post: PostViewModel
  ) {
    let fileFound = post.mediaFiles.find(x => x.name == newFile.name);
    if (!fileFound) {
      let file: MediaFileAssetViewModel = new MediaFileAssetViewModel();
      file.base64File = Object.assign({}, newFile.base64File);
      file.file = Object.assign({}, newFile.file);
      file.name = newFile.name;
      file.isCropped = false;
      file.type = newFile.type;
      if (newFile.thumbnailFile) {
        file.thumbnailFile = Object.assign({}, newFile.thumbnailFile);
      }
      file.croppedImages = [];

      post.mediaFiles.push(file);
      post.type = this.setPostTypeRelatedToMediaFile(post);
      // }
    }
    return post;
  }

  uniquSelectedSocialNetworks(
    selectedSocialAccountsArtifactsArray: Array<SocialAccountForCreate>
  ) {
    var selectedNetworks = [];
    let found = -1;
    selectedSocialAccountsArtifactsArray.forEach(account => {
      selectedNetworks.push(account.socialAccountObj.type);
    });
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    var uniqueSelectedNetworks = selectedNetworks.filter(onlyUnique);
    // selectedNetworks$.next(uniqueSelectedNetworks);
    return uniqueSelectedNetworks;
  }
  removePostRelatedCroppedImages(
    socialAccountsPage: SocialAccountForCreate,
    campaignMediaFiles: Array<MediaFileAssetViewModel>
  ) {
    campaignMediaFiles.forEach(x => {
      let imageFound = x.croppedImages.findIndex(
        x => x.network == socialAccountsPage.socialAccountObj.type
      );
      if (imageFound > -1) {
        x.croppedImages.splice(imageFound, 1);
      }
    });

    return campaignMediaFiles;
  }

  onAddMediaFile(
    newFile: MediaFileAssetViewModel,
    campaignViewModel: CampaignViewModel
  ) {
    let fileFound = campaignViewModel.mediaFiles.find(
      x => x.name == newFile.name
    );
    if (fileFound) {
      fileFound = Object.assign({}, newFile);
    } else {
      campaignViewModel.mediaFiles.push(Object.assign({}, newFile));
    }
    campaignViewModel.posts.forEach(post => {
      let fileFound = post.mediaFiles.find(x => x.name == newFile.name);
      if (!fileFound) {
        let file: MediaFileAssetViewModel = new MediaFileAssetViewModel();
        file.base64File = Object.assign({}, newFile.base64File);
        file.file = Object.assign({}, newFile.file);
        file.name = newFile.name;
        file.isCropped = false;
        if (newFile.thumbnailFile) {
          file.thumbnailFile.file = newFile.thumbnailFile.file;
        }
        file.croppedImages = [];
        if (
          (post.type == "video/mp4" && file.type == "video/mp4") ||
          (post.type != "video/mp4" && file.type != "video/mp4") ||
          post.type == "text"
        ) {
          post.mediaFiles.push(file);

          post.type = this.setPostTypeRelatedToMediaFile(post);
        }
      }
    });
    return campaignViewModel;
  }

  fillCampaignAndPostWithCroppedImage(
    incomingCroppedfile: MediaFileAssetViewModel,
    campaignViewModel: CampaignViewModel
  ) {
    let existingImageFile = campaignViewModel.mediaFiles.find(
      x =>
        x.originalFilename == incomingCroppedfile.name ||
        x.name == incomingCroppedfile.name
    );
    if (existingImageFile != null) {
      let existingCroppedImage = null;
      if (
        existingImageFile.croppedImages &&
        existingImageFile.croppedImages.length > 0
      ) {
        existingCroppedImage = existingImageFile.croppedImages.find(
          x =>
            (x.originalFilename == incomingCroppedfile.name ||
              x.name == incomingCroppedfile.name) &&
            (x.network == incomingCroppedfile.network ||
              incomingCroppedfile.network == "All")
        );

        if (existingCroppedImage) {
          if (existingCroppedImage.id && existingCroppedImage.id != "") {
            existingCroppedImage.id = "";
          }
          existingCroppedImage.file = incomingCroppedfile.file;
          existingCroppedImage.base64File = incomingCroppedfile.base64File;
          existingCroppedImage.name = incomingCroppedfile.name;
          // file.isCropped = true;
          existingCroppedImage.isCropped = true;
          existingCroppedImage.tags = incomingCroppedfile.tags;
          existingCroppedImage.network = incomingCroppedfile.network;
        }
      }

      if (!existingCroppedImage) {
        let newCroppedFile: MediaFileAssetViewModel = new MediaFileAssetViewModel();
        newCroppedFile.base64File = incomingCroppedfile.base64File;
        newCroppedFile.file = incomingCroppedfile.file;
        newCroppedFile.name = incomingCroppedfile.name;
        newCroppedFile.network = incomingCroppedfile.base64File.type;
        newCroppedFile.isCropped = true;
        newCroppedFile.tags = incomingCroppedfile.tags;
        newCroppedFile.network = incomingCroppedfile.network;

        existingImageFile.croppedImages.push(newCroppedFile);
      }
    }

    campaignViewModel.posts.forEach((post, index) => {
      let existingCroppedFile = post.mediaFiles.find(
        x =>
          (x.originalFilename == incomingCroppedfile.name ||
            x.name == incomingCroppedfile.name) &&
          (post.network == incomingCroppedfile.network ||
            incomingCroppedfile.network == "All")
      );
      if (existingCroppedFile) {
        if (existingCroppedFile.id && existingCroppedFile.isCropped) {
          campaignViewModel.deletedPersistantImages.push(
            existingCroppedFile.name
          );
          existingCroppedFile.originalFilename = "";
        }
        existingCroppedFile.id = "";
        // existingCroppedFile = new MediaFileAssetViewModel();
        existingCroppedFile.base64File = incomingCroppedfile.base64File;
        existingCroppedFile.file = incomingCroppedfile.file;
        existingCroppedFile.isCropped = true;
        existingCroppedFile.network = post.network;
        existingCroppedFile.name = incomingCroppedfile.name;
        existingCroppedFile.type = incomingCroppedfile.file.type;
        existingCroppedFile.tags = incomingCroppedfile.tags;
        // postsArrayToShow$.next(this.campaignViewModel.posts);
      }
      // })
    });

    return campaignViewModel;
  }

  onAddOrRemoveTags(image, campaignViewModel: CampaignViewModel) {
    if (image.id && image.id != "") {
      let findIndex = campaignViewModel.mediaFiles.findIndex(
        x => x.originalFilename == image.originalFilename
      );

      if (findIndex > -1) {
        campaignViewModel.mediaFiles[findIndex].tags = Object.assign(
          [],
          image.tags
        );
      }
      campaignViewModel.posts.forEach(post => {
        let findIndex = post.mediaFiles.findIndex(
          x => x.originalFilename == image.originalFilename
        );
        if (findIndex > -1) {
          post.mediaFiles[findIndex].tags = image.tags;
        }
      });
    } else {
      let findIndex = campaignViewModel.mediaFiles.findIndex(
        x => x.name == image.name
      );

      if (findIndex > -1) {
        campaignViewModel.mediaFiles[findIndex].tags = Object.assign(
          [],
          image.tags
        );
      }
      campaignViewModel.posts.forEach(post => {
        let findIndex = post.mediaFiles.findIndex(x => x.name == image.name);
        if (findIndex > -1) {
          post.mediaFiles[findIndex].tags = image.tags;
        }
      });
    }

    return campaignViewModel;
  }

  removeThumbnailsFromMediaFilesViewModel(
    files: Array<MediaFileAssetViewModel>
  ) {
    files.forEach(file => {
      delete file["thumbnailName"];
      delete file["base64File"]["thumbnailName"];
    });
    return files;
  }

  removeIdFromMediaFilesViewModel(files: Array<MediaFileAssetViewModel>) {
    files.forEach(file => {
      delete file["id"];
    });
  }

  async tobase64(serverFile: MediaFileAssetViewModel) {
    // serverFile.base64File.name = serverFile.name;
    // return new Promise((resolve, reject) => {
    return this.mediaAssetConversionUtil.serverFileToBase64(serverFile);
    //    .then(serverFile => {
    //         return resolve(serverFile);
    //     });
    // })
  }

  serverFileToNewFile(serverfile) {
    return new Promise((resolve, reject) => {
      let cFile = { name: "", src: "", type: "" };
      cFile.src = this.imagePath + serverfile.name;
      cFile.name = serverfile.originalFilename;
      cFile.type = serverfile.type;
      this.mediaAssetConversionUtil.base64ToFile(cFile).then((file: File) => {
        // serverfile.file = file;
        Object.defineProperty(file, "name", {
          writable: true,
          value: UUID.UUID() + file.name
        });
        serverfile.file = file;
        return resolve(serverfile);
      });
    });
  }

  async toThumbnailFileFromServerFile(serverfile: MediaFileAssetViewModel) {
    return new Promise((resolve, reject) => {
      // if (serverfile.base64File) {
      //     this.mediaAssetConversionUtil.base64ToFile(serverfile.base64File).then((file: File) => {
      //         serverfile.file = file;
      //         return resolve(serverfile);
      //     })
      // } else if (!serverfile.base64File || !serverfile.base64File.src) {
      let cFile = { name: "", src: "", type: "" };
      cFile.src = this.imagePath + serverfile.thumbnailName;
      cFile.name = serverfile.originalFilename;
      cFile.type = "image.png";
      this.mediaAssetConversionUtil.base64ToFile(cFile).then((file: File) => {
        // serverfile.file = file;
        serverfile.thumbnailFile.file = file;
        // serverfile.file = file
        return resolve(serverfile);
      });
      // }
    });
  }

  async toFile(serverfile: MediaFileAssetViewModel) {
    return new Promise((resolve, reject) => {
      // if (serverfile.base64File) {
      //     this.mediaAssetConversionUtil.base64ToFile(serverfile.base64File).then((file: File) => {
      //         serverfile.file = file;
      //         return resolve(serverfile);
      //     })
      // } else if (!serverfile.base64File || !serverfile.base64File.src) {
      let cFile = { name: "", src: "", type: "" };
      cFile.src = this.imagePath + serverfile.name;
      cFile.name = serverfile.originalFilename;
      cFile.type = serverfile.type;
      this.mediaAssetConversionUtil.base64ToFile(cFile).then((file: File) => {
        // serverfile.file = file;
        serverfile.name = file.name;
        serverfile.file = file;
        return resolve(serverfile);
      });
      // }
    });
  }
  replacethumbnailbase64InFileViewModel(serverfile) {
    return new Promise((resolve, reject) => {
      this.mediaAssetConversionUtil
        .urlToBase64(this.imagePath + serverfile.thumbnailName)
        .then(src => {
          serverfile.thumbnailFile.base64File.src = src;
          return resolve(serverfile);
        });
    });
  }
  convertToThumbnailbase64AndFile(serverFiles) {
    let promises: Array<Promise<any>> = new Array<Promise<any>>();
    serverFiles.forEach(async (serverfile: MediaFileAssetViewModel, index) => {
      serverfile.thumbnailFile = new MediaFileAssetViewModel();

      // this.mediaAssetConversionUtil.urlToBase64(this.imagePath + serverfile.thumbnailName).then(src=>{
      //     serverfile.thumbnailFile.base64File.src =src;
      // })
      promises.push(this.replacethumbnailbase64InFileViewModel(serverfile));
      console.log("base64 conversion", new Date());

      promises.push(this.toThumbnailFileFromServerFile(serverfile));

      // console.log("for loop", new Date());
    });
    // console.log(new Date());
    return Promise.all(promises);
  }

  makePostOnAddnewNetwork(
    selectedArtifact: SocialAccountForCreate,
    campaignViewModel: CampaignViewModel,
    selectedArtifactsArray: Array<SocialAccountForCreate>
  ) {
    let ifImageExist = campaignViewModel.mediaFiles.some(
      x => x.type != "video/mp4"
    );
    let ifVideoExist = campaignViewModel.mediaFiles.some(
      x => x.type == "video/mp4"
    );
    let ifMultipleImages = campaignViewModel.mediaFiles.filter(
      x => x.type != "video/mp4"
    );
    let ifMultipleVideos = campaignViewModel.mediaFiles.filter(
      x => x.type == "video/mp4"
    );
    // postViewObj.scheduleAt = this.campaignViewModel.scheduledAt;
    let noOfPosts = [];
    if (ifImageExist) {
      noOfPosts.push("image");
    }
    if (ifVideoExist) {
      noOfPosts.push("video");
    }
    if (noOfPosts.length == 0) {
      noOfPosts.push("text");
    }
    if (noOfPosts.length > 1) {
      selectedArtifactsArray.push(selectedArtifact);
    }
    noOfPosts.forEach(postType => {
      let postViewObj: PostViewModel = new PostViewModel();
      postViewObj.description = campaignViewModel.description;
      postViewObj.socialMediaAccountId = selectedArtifact.socialAccountObj.id;
      postViewObj.network = selectedArtifact.socialAccountObj.type;
      postViewObj.ownerId = this.profileStore.userId;
      postViewObj.error = "";
      postViewObj.type =
        postType == "text"
          ? "text"
          : postType == "image" && ifMultipleImages.length == 1
          ? "image"
          : postType == "image" && ifMultipleImages.length > 1
          ? "multiple-images"
          : postType == "video" && ifMultipleVideos.length == 1
          ? "video"
          : postType == "video" && ifMultipleVideos.length > 1
          ? "multiple-videos"
          : "error";
      postViewObj.socialMediaInfo = Object.assign({}, selectedArtifact.pageObj);
      //postViewObj.mediaFiles=this.campaignViewModel.mediaFiles;
      let isCropedImageExist: boolean = false;
      if (campaignViewModel.mediaFiles.length >= 1) {
        campaignViewModel.mediaFiles.forEach(x => {
          isCropedImageExist = false;

          if (x.croppedImages.length >= 1 && postType == "image") {
            var cropedImage = x.croppedImages.find(
              x => x.network == postViewObj.network || x.network == "All"
            );
            if (cropedImage) {
              postViewObj.mediaFiles.push(Object.assign({}, cropedImage));
              isCropedImageExist = true;
            }
          }

          if (!isCropedImageExist) {
            let file: MediaFileAssetViewModel = new MediaFileAssetViewModel();
            file.base64File = Object.assign({}, x.base64File);
            file.croppedImages = Object.assign([], x.croppedImages);
            file.file = Object.assign({}, x.file);
            file.name = x.name;
            if (x.id && x.id != "") {
              file.originalFilename = x.originalFilename;
              file.thumbnailName = x.thumbnailName;
              file.id = x.id;
            } else {
              file.thumbnailFile == Object.assign({}, x.thumbnailFile);
            }
            file.tags = Object.assign([], x.tags);
            file.isCropped = false;
            file.type = x.type;
            if (x.type == "video/mp4" && postType == "video") {
              postViewObj.mediaFiles.push(
                Object.assign({ croppedImages: [] }, file)
              );
            } else if (x.type != "video/mp4" && postType != "video") {
              postViewObj.mediaFiles.push(
                Object.assign({ croppedImages: [] }, file)
              );
            }
          }
        });
      }

      campaignViewModel.posts.push(postViewObj);
      //   postsArrayToShow$.next(this.campaignViewModel.posts);
    });
    return campaignViewModel;
  }
  removeOneSelectedArtifactRelatedToPost(
    post: PostViewModel,
    selectedSocialAccountsArtifactsArray: Array<SocialAccountForCreate>
  ) {
    let findIndex = selectedSocialAccountsArtifactsArray.findIndex(
      x =>
        x.socialAccountObj.id == post.socialMediaAccountId &&
        x.pageObj.id == post.socialMediaInfo.id
    );

    if (findIndex > -1) {
      selectedSocialAccountsArtifactsArray.splice(findIndex, 1);
    }
    return selectedSocialAccountsArtifactsArray;
  }
  fileRead(
    isConvertToFile,
    isConvertToBase64,
    files: Array<MediaFileAssetViewModel>
  ) {
    // return new Promise((resolve, reject) => {
    // length = 0;
    let promises: Array<Promise<any>> = new Array<Promise<any>>();
    files.forEach(async (serverfile: MediaFileAssetViewModel, index) => {
      if (isConvertToBase64) {
        promises.push(
          this.mediaAssetConversionUtil.serverFileToBase64(serverfile)
        );
        console.log("base64 conversion", new Date());

        //
        // if (files.length == (index + 1) && !isConvertToFile) {

        // return resolve(files);
        // }
      }

      if (isConvertToFile) {
        //  ;
        // await this.toFile(serverfile)
        promises.push(this.toFile(serverfile));
      }
      console.log("for loop", new Date());
    });
    console.log(new Date());
    return Promise.all(promises);
    // return resolve(files);
    // })
  }

  deletePostsToShow(
    socialAccountsArtifact: SocialAccountForCreate,
    campaignViewModel: CampaignViewModel
  ) {
    // let postsToDelete = [];
    let loopLength = campaignViewModel.posts.length;
    for (let i = 0; i < loopLength; i++) {
      let findIndex = campaignViewModel.posts.findIndex(
        x =>
          x.socialMediaAccountId ==
            socialAccountsArtifact.socialAccountObj.id &&
          x.socialMediaInfo.id == socialAccountsArtifact.pageObj.id
      );

      // this.campaignViewModel.posts.forEach((post, index) => {
      if (findIndex > -1) {
        if (
          campaignViewModel.posts[findIndex].id &&
          campaignViewModel.posts[findIndex].id != ""
        ) {
          campaignViewModel.postsToDelete.push(
            campaignViewModel.posts[findIndex]
          );
          // this.deleteCroppedImagesfromDeletedPost(this.campaignViewModel.posts[findIndex].mediaFiles);
        }
        campaignViewModel.posts.splice(findIndex, 1);
        // postsArrayToShow$.next(campaignViewModel.posts);
      }
    }
  }

  deletePostContainThisFile(
    post: PostViewModel,
    incomingFile: MediaFileAssetViewModel,
    campaignViewModel: CampaignViewModel
  ) {
    let postToDelete = campaignViewModel.posts.findIndex(
      x =>
        x.mediaFiles.find(x => x.type == incomingFile.type) &&
        x.socialMediaAccountId == post.socialMediaAccountId &&
        x.socialMediaInfo.id == post.socialMediaInfo.id
    );

    if (postToDelete > -1) {
      if (post.id) {
        campaignViewModel.postsToDelete.push(
          campaignViewModel.posts[postToDelete]
        );
      }
      campaignViewModel.posts.splice(postToDelete, 1);
    }

    return campaignViewModel.posts;
  }

  makePostForViewModelOnAddNewTypeFile(
    newFile: MediaFileAssetViewModel,
    selectedArtifact: SocialAccountForCreate,
    campaignViewModel: CampaignViewModel
  ) {
    let postViewObj: PostViewModel = new PostViewModel();
    postViewObj.description = campaignViewModel.description;
    postViewObj.socialMediaAccountId = selectedArtifact.socialAccountObj.id;
    postViewObj.network = selectedArtifact.socialAccountObj.type;
    postViewObj.ownerId = selectedArtifact.socialAccountObj.registerUserId;
    postViewObj.error = "";
    postViewObj.type =
      newFile.type == "video/mp4"
        ? "video"
        : newFile.type != "video/mp4"
        ? "image"
        : "error on making image relative post";
    postViewObj.socialMediaInfo = Object.assign({}, selectedArtifact.pageObj);

    let file: MediaFileAssetViewModel = new MediaFileAssetViewModel();
    file.base64File = Object.assign({}, newFile.base64File);
    file.file = Object.assign({}, newFile.file);
    file.name = newFile.name;
    file.isCropped = false;
    file.type = newFile.type;
    postViewObj.mediaFiles.push(file);

    campaignViewModel.posts.push(postViewObj);
    // this.postsArrayToShow$.next(this.campaignViewModel.posts);

    return campaignViewModel;
  }

  assignScheduleDate(campaign) {
    let dateAssigned = false;
    return Observable.of(campaign.scheduledAt);
    // dateAssigned = true;
  }
}
