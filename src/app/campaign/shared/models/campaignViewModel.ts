import { Post, Campaign } from "../../../shared/sdk";
import { MediaFileAssetViewModel } from "./mediaFileAssetViewModel";
import { PostViewModel } from "./postViewModel";
import { MediaFileAsset } from "../../../shared/sdk/models/MediaFileAsset";
export class CampaignViewModel {
  title: string;
  type: string;
  description: string;
  createdAt: Date;
  scheduledAt: Date;
  state: string;
  error: string;
  name: string;
  id: any;
  ownerId: string;
  createdOn: Date;
  updatedOn: Date;
  posts: Array<PostViewModel> = [];
  mediaFiles: Array<MediaFileAssetViewModel>;
  deletedPersistantImages: Array<any>;
  postsToDelete: Array<PostViewModel>;
  currentDate: Date;
  // filesToUpload: Array<any> = [];

  constructor() {
    this.title = "";
    this.description = "";
    this.currentDate = new Date();
    this.error = "";
    // this.filesToUpload = [];
    this.mediaFiles = [];
    this.id = "";
    this.name = "";
    this.deletedPersistantImages = [];
    this.posts = [];
    this.state = "";
    this.postsToDelete = [];
  }

  toServerModel() {
    let campaign: Campaign = new Campaign();

    campaign.title = this.title;
    campaign.description = this.description;
    campaign.state = this.state;
    campaign.createdAt = new Date();
    campaign.registerUserId = this.ownerId;
    campaign.scheduledAt = this.scheduledAt;

    if (this.mediaFiles.length >= 1) {
      this.mediaFiles.forEach(file => {
        campaign.mediaFiles.push(file.file);
      });
    }
    return campaign;
  }

  toServerModelWithoutMediaFiles() {
    let campaign: Campaign = new Campaign();

    campaign.title = this.title;
    campaign.description = this.description;
    campaign.state = this.state;

    campaign.createdAt = new Date();
    campaign.type = this.type;
    campaign.registerUserId = this.ownerId;
    campaign.scheduledAt = this.scheduledAt;
    if (this.id && this.id != "") {
      campaign.id = this.id;
    }
    campaign.mediaFiles = [];
    // if (this.mediaFiles.length >= 1) {
    //     this.mediaFiles.forEach(file => {
    //         campaign.mediaFiles.push(file.file);
    //     });
    // }

    return campaign;
  }

  populateFromServerModel(campaign: Campaign) {
    this.title = campaign.title;
    this.type = campaign.type;
    this.description = campaign.description;
    this.createdAt = campaign.createdAt;
    this.scheduledAt = campaign.scheduledAt;
    this.state = campaign.state;

    this.error = campaign.error;
    this.name = campaign.name;
    if (campaign.state != "Posted" && campaign.state != "Canceled") {
      this.id = campaign.id;
    }
    this.ownerId = campaign.registerUserId;
    this.createdOn = campaign.createdOn;
    this.updatedOn = campaign.updatedOn;

    // this.mediaFiles = campaign.mediaFiles;
    if (campaign.mediaFiles.length >= 1) {
      campaign.mediaFiles.forEach((file: MediaFileAsset) => {
        let mediaFile: MediaFileAssetViewModel = new MediaFileAssetViewModel();
        mediaFile.populateFromServerModel(file);

        campaign.posts.forEach(post => {
          let find = -1;
          find = post.mediaFiles.findIndex(
            x =>
              x.originalFilename == file.originalFilename && x.isCropped == true
          );
          if (find > -1) {
            let croppedMediaFile: MediaFileAssetViewModel = new MediaFileAssetViewModel();
            croppedMediaFile.populateFromServerModel(post.mediaFiles[find]);
            mediaFile.croppedImages.push(croppedMediaFile);
          } else {
            mediaFile.isCropped = false;
          }
        });
        this.mediaFiles.push(mediaFile);
      });
    }

    if (campaign.posts && campaign.posts.length >= 1) {
      campaign.posts.forEach((post: Post) => {
        let postVM: PostViewModel = new PostViewModel();
        postVM.populateFromServerModel(post);
        this.posts.push(postVM);
      });
    }
    // this.deletedPersistantImages = [];
  }
}
