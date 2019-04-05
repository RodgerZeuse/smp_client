/* tslint:disable */
import {
  SocialMediaAccount,
  MediaFileAsset,
  Comments,
  CampaignStatus,
  PostAnalytics
} from '../index';

declare var Object: any;
export interface PostInterface {
  "scheduleDate"?: Date;
  "socialMediaInfo"?: any;
  "network"?: string;
  "error"?: string;
  "name"?: string;
  "state"?: string;
  "description"?: string;
  "type"?: string;
  "id"?: any;
  "socialMediaAccountId"?: any;
  "registerUserId"?: any;
  "campaignId"?: any;
  "createdOn"?: Date;
  "updatedOn"?: Date;
  "mediaFiles"?: Array<any>;
  "campaignStatusId"?: any;
  "statusId"?: any;
  socialMediaAccounts?: SocialMediaAccount;
  mediaFile?: MediaFileAsset[];
  postComments?: Comments[];
  campaignStatuses?: CampaignStatus;
  postAnalytics?: PostAnalytics;
}

export class Post implements PostInterface {
  "scheduleDate": Date;
  "socialMediaInfo": any;
  "network": string;
  "error": string;
  "name": string;
  "state": string;
  "description": string;
  "type": string;
  "id": any;
  "socialMediaAccountId": any;
  "registerUserId": any;
  "campaignId": any;
  "createdOn": Date;
  "updatedOn": Date;
  "mediaFiles": Array<any>;
  "campaignStatusId": any;
  "statusId": any;
  socialMediaAccounts: SocialMediaAccount;
  mediaFile: MediaFileAsset[];
  postComments: Comments[];
  campaignStatuses: CampaignStatus;
  postAnalytics: PostAnalytics;
  constructor(data?: PostInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Post`.
   */
  public static getModelName() {
    return "Post";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Post for dynamic purposes.
  **/
  public static factory(data: PostInterface): Post{
    return new Post(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'Post',
      plural: 'posts',
      path: 'posts',
      idName: 'id',
      properties: {
        "scheduleDate": {
          name: 'scheduleDate',
          type: 'Date'
        },
        "socialMediaInfo": {
          name: 'socialMediaInfo',
          type: 'any'
        },
        "network": {
          name: 'network',
          type: 'string'
        },
        "error": {
          name: 'error',
          type: 'string',
          default: ''
        },
        "name": {
          name: 'name',
          type: 'string',
          default: 'Post'
        },
        "state": {
          name: 'state',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "type": {
          name: 'type',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "socialMediaAccountId": {
          name: 'socialMediaAccountId',
          type: 'any'
        },
        "registerUserId": {
          name: 'registerUserId',
          type: 'any'
        },
        "campaignId": {
          name: 'campaignId',
          type: 'any'
        },
        "createdOn": {
          name: 'createdOn',
          type: 'Date'
        },
        "updatedOn": {
          name: 'updatedOn',
          type: 'Date'
        },
        "mediaFiles": {
          name: 'mediaFiles',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "campaignStatusId": {
          name: 'campaignStatusId',
          type: 'any'
        },
        "statusId": {
          name: 'statusId',
          type: 'any'
        },
      },
      relations: {
        socialMediaAccounts: {
          name: 'socialMediaAccounts',
          type: 'SocialMediaAccount',
          model: 'SocialMediaAccount',
          relationType: 'belongsTo',
                  keyFrom: 'socialMediaAccountId',
          keyTo: 'id'
        },
        mediaFile: {
          name: 'mediaFile',
          type: 'MediaFileAsset[]',
          model: 'MediaFileAsset',
          relationType: 'embedsMany',
                  keyFrom: 'mediaFiles',
          keyTo: 'id'
        },
        postComments: {
          name: 'postComments',
          type: 'Comments[]',
          model: 'Comments',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'postId'
        },
        campaignStatuses: {
          name: 'campaignStatuses',
          type: 'CampaignStatus',
          model: 'CampaignStatus',
          relationType: 'belongsTo',
                  keyFrom: 'statusId',
          keyTo: 'id'
        },
        postAnalytics: {
          name: 'postAnalytics',
          type: 'PostAnalytics',
          model: 'PostAnalytics',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'postId'
        },
      }
    }
  }
}
