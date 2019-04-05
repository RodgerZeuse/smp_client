/* tslint:disable */
import {
  Comments,
  MediaFileAsset,
  Invites,
  CampaignStatus,
  PostArchive
} from '../index';

declare var Object: any;
export interface CampaignArchiveInterface {
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
  "mediaFiles"?: Array<any>;
  "statusId"?: any;
  "registerUserId"?: any;
  campaignComments?: Comments[];
  mediaFile?: MediaFileAsset[];
  invites?: Invites[];
  campaignStatuses?: CampaignStatus;
  posts?: PostArchive[];
}

export class CampaignArchive implements CampaignArchiveInterface {
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
  "mediaFiles": Array<any>;
  "statusId": any;
  "registerUserId": any;
  campaignComments: Comments[];
  mediaFile: MediaFileAsset[];
  invites: Invites[];
  campaignStatuses: CampaignStatus;
  posts: PostArchive[];
  constructor(data?: CampaignArchiveInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `CampaignArchive`.
   */
  public static getModelName() {
    return "CampaignArchive";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of CampaignArchive for dynamic purposes.
  **/
  public static factory(data: CampaignArchiveInterface): CampaignArchive{
    return new CampaignArchive(data);
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
      name: 'CampaignArchive',
      plural: 'CampaignArchives',
      path: 'CampaignArchives',
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
        "mediaFiles": {
          name: 'mediaFiles',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "statusId": {
          name: 'statusId',
          type: 'any'
        },
        "registerUserId": {
          name: 'registerUserId',
          type: 'any'
        },
      },
      relations: {
        campaignComments: {
          name: 'campaignComments',
          type: 'Comments[]',
          model: 'Comments',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'campaignArchiveId'
        },
        mediaFile: {
          name: 'mediaFile',
          type: 'MediaFileAsset[]',
          model: 'MediaFileAsset',
          relationType: 'embedsMany',
                  keyFrom: 'mediaFiles',
          keyTo: 'id'
        },
        invites: {
          name: 'invites',
          type: 'Invites[]',
          model: 'Invites',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'campaignArchiveId'
        },
        campaignStatuses: {
          name: 'campaignStatuses',
          type: 'CampaignStatus',
          model: 'CampaignStatus',
          relationType: 'belongsTo',
                  keyFrom: 'statusId',
          keyTo: 'id'
        },
        posts: {
          name: 'posts',
          type: 'PostArchive[]',
          model: 'PostArchive',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'campaignArchiveId'
        },
      }
    }
  }
}
