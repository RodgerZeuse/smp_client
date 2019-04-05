/* tslint:disable */
import {
  Post,
  MediaFileAsset,
  Comments,
  CampaignStatus,
  Invites
} from '../index';

declare var Object: any;
export interface CampaignInterface {
  "title"?: string;
  "type"?: string;
  "description"?: string;
  "createdAt"?: Date;
  "scheduledAt"?: Date;
  "state"?: string;
  "hashTags"?: Array<any>;
  "error"?: string;
  "name"?: string;
  "success"?: string;
  "id"?: any;
  "registerUserId"?: any;
  "createdOn": Date;
  "updatedOn": Date;
  "mediaFiles"?: Array<any>;
  "companyId"?: any;
  "statusId"?: any;
  posts?: Post[];
  mediaFile?: MediaFileAsset[];
  campaignComments?: Comments[];
  campaignStatuses?: CampaignStatus;
  invites?: Invites[];
}

export class Campaign implements CampaignInterface {
  "title": string;
  "type": string;
  "description": string;
  "createdAt": Date;
  "scheduledAt": Date;
  "state": string;
  "hashTags": Array<any>;
  "error": string;
  "name": string;
  "success": string;
  "id": any;
  "registerUserId": any;
  "createdOn": Date;
  "updatedOn": Date;
  "mediaFiles": Array<any>;
  "companyId": any;
  "statusId": any;
  posts: Post[];
  mediaFile: MediaFileAsset[];
  campaignComments: Comments[];
  campaignStatuses: CampaignStatus;
  invites: Invites[];
  constructor(data?: CampaignInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Campaign`.
   */
  public static getModelName() {
    return "Campaign";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Campaign for dynamic purposes.
  **/
  public static factory(data: CampaignInterface): Campaign{
    return new Campaign(data);
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
      name: 'Campaign',
      plural: 'campaigns',
      path: 'campaigns',
      idName: 'id',
      properties: {
        "title": {
          name: 'title',
          type: 'string'
        },
        "type": {
          name: 'type',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "createdAt": {
          name: 'createdAt',
          type: 'Date'
        },
        "scheduledAt": {
          name: 'scheduledAt',
          type: 'Date'
        },
        "state": {
          name: 'state',
          type: 'string'
        },
        "hashTags": {
          name: 'hashTags',
          type: 'Array&lt;any&gt;'
        },
        "error": {
          name: 'error',
          type: 'string'
        },
        "name": {
          name: 'name',
          type: 'string',
          default: 'Campaign'
        },
        "success": {
          name: 'success',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "registerUserId": {
          name: 'registerUserId',
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
        "companyId": {
          name: 'companyId',
          type: 'any'
        },
        "statusId": {
          name: 'statusId',
          type: 'any'
        },
      },
      relations: {
        posts: {
          name: 'posts',
          type: 'Post[]',
          model: 'Post',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'campaignId'
        },
        mediaFile: {
          name: 'mediaFile',
          type: 'MediaFileAsset[]',
          model: 'MediaFileAsset',
          relationType: 'embedsMany',
                  keyFrom: 'mediaFiles',
          keyTo: 'id'
        },
        campaignComments: {
          name: 'campaignComments',
          type: 'Comments[]',
          model: 'Comments',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'campaignId'
        },
        campaignStatuses: {
          name: 'campaignStatuses',
          type: 'CampaignStatus',
          model: 'CampaignStatus',
          relationType: 'belongsTo',
                  keyFrom: 'statusId',
          keyTo: 'id'
        },
        invites: {
          name: 'invites',
          type: 'Invites[]',
          model: 'Invites',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'campaignId'
        },
      }
    }
  }
}
