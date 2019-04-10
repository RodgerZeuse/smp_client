/* tslint:disable */
import {
  Post,
  MediaFileAsset
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
  "timezone"?: string;
  "success"?: string;
  "offset"?: string;
  "id"?: any;
  "registerUserId"?: any;
  "createdOn": Date;
  "updatedOn": Date;
  "mediaFiles"?: Array<any>;
  posts?: Post[];
  mediaFile?: MediaFileAsset[];
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
  "timezone": string;
  "success": string;
  "offset": string;
  "id": any;
  "registerUserId": any;
  "createdOn": Date;
  "updatedOn": Date;
  "mediaFiles": Array<any>;
  posts: Post[];
  mediaFile: MediaFileAsset[];
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
        "timezone": {
          name: 'timezone',
          type: 'string'
        },
        "success": {
          name: 'success',
          type: 'string'
        },
        "offset": {
          name: 'offset',
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
      }
    }
  }
}
