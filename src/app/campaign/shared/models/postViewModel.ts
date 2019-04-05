import { SocialMediaAccount, Comments, Campaign, Post, CampaignStatus } from "../../../shared/sdk";
import { MediaFileAsset } from "../../../shared/sdk/models/MediaFileAsset";
import { MediaFileAssetViewModel } from "./mediaFileAssetViewModel";

export class PostViewModel {


    description: string;
    scheduleAt: Date;
    state: string;
    // campaignStatus: CampaignStatus;
    createdOn: Date;
    mediaFiles: Array<MediaFileAssetViewModel> = [];
    socialMediaInfo: any;
    network: string;
    error: string;
    name: string;
    type: string;
    id: any;
    socialMediaAccountId: any;
    ownerId: string;
    campaignId: any;

    // updatedOn: Date;

    socialMediaAccounts: SocialMediaAccount;
    // postComments: Comments[];

    toServerModelWithoutFiles() {
        let post: Post = new Post();
        post.description = this.description;
        post.network = this.network;
        post.scheduleDate = this.scheduleAt;
        post.state = this.state;
        post.type = this.type;
        // post.campaignStatusId = this.campaignStatus.id;
        post.socialMediaInfo = this.socialMediaInfo;
        post.registerUserId = this.ownerId;
        post.socialMediaAccountId = this.socialMediaAccountId;
        post.mediaFiles = [];

        if (this.id && this.id != '') {
            post.id = this.id;
        }

        return post;
    }

    populateFromServerModel(post: Post) {



        this.description = post.description;

        this.state = post.state;
        this.network = post.network;
        this.campaignId = post.campaignId;
        this.scheduleAt = post.scheduleDate;
        this.socialMediaInfo = post.socialMediaInfo;
        this.socialMediaAccounts = post.socialMediaAccounts;
        this.error = post.error;
        this.type = post.type;
        this.socialMediaAccountId = post.socialMediaAccountId;
        this.id = post.id;
        // this.campaignStatus=post.campaignStatus;
        // this.createdByUser = post.registerUserId;
        // this.mediaFiles = post._mediaFiles;
        post.mediaFiles.forEach((file: MediaFileAsset) => {
            let mediaFile: MediaFileAssetViewModel = new MediaFileAssetViewModel();
            mediaFile.populateFromServerModel(file);
            this.mediaFiles.push(mediaFile);
        })
    }
}