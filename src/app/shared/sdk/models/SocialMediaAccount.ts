/* tslint:disable */
import {
  Post
} from '../index';

declare var Object: any;
export interface SocialMediaAccountInterface {
  "type"?: string;
  "session"?: any;
  "status"?: string;
  "isActive"?: boolean;
  "followersCount"?: number;
  "userName"?: string;
  "userId"?: string;
  "pictureThumbnail"?: string;
  "lengthSession"?: any;
  "businesses"?: Array<any>;
  "adAccounts"?: Array<any>;
  "accountPostInfoId"?: string;
  "smPages"?: Array<any>;
  "smGroups"?: Array<any>;
  "linked"?: any;
  "id"?: any;
  "registerUserId"?: any;
  posts?: Post[];
}

export class SocialMediaAccount implements SocialMediaAccountInterface {
  "type": string;
  "session": any;
  "status": string;
  "isActive": boolean;
  "followersCount": number;
  "userName": string;
  "userId": string;
  "pictureThumbnail": string;
  "lengthSession": any;
  "businesses": Array<any>;
  "adAccounts": Array<any>;
  "accountPostInfoId": string;
  "smPages": Array<any>;
  "smGroups": Array<any>;
  "linked": any;
  "id": any;
  "registerUserId": any;
  posts: Post[];
  constructor(data?: SocialMediaAccountInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `SocialMediaAccount`.
   */
  public static getModelName() {
    return "SocialMediaAccount";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of SocialMediaAccount for dynamic purposes.
  **/
  public static factory(data: SocialMediaAccountInterface): SocialMediaAccount{
    return new SocialMediaAccount(data);
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
      name: 'SocialMediaAccount',
      plural: 'SocialMediaAccounts',
      path: 'SocialMediaAccounts',
      idName: 'id',
      properties: {
        "type": {
          name: 'type',
          type: 'string',
          default: 'FB'
        },
        "session": {
          name: 'session',
          type: 'any'
        },
        "status": {
          name: 'status',
          type: 'string'
        },
        "isActive": {
          name: 'isActive',
          type: 'boolean',
          default: false
        },
        "followersCount": {
          name: 'followersCount',
          type: 'number',
          default: 0
        },
        "userName": {
          name: 'userName',
          type: 'string'
        },
        "userId": {
          name: 'userId',
          type: 'string'
        },
        "pictureThumbnail": {
          name: 'pictureThumbnail',
          type: 'string',
          default: '\\'
        },
        "lengthSession": {
          name: 'lengthSession',
          type: 'any'
        },
        "businesses": {
          name: 'businesses',
          type: 'Array&lt;any&gt;'
        },
        "adAccounts": {
          name: 'adAccounts',
          type: 'Array&lt;any&gt;'
        },
        "accountPostInfoId": {
          name: 'accountPostInfoId',
          type: 'string'
        },
        "smPages": {
          name: 'smPages',
          type: 'Array&lt;any&gt;'
        },
        "smGroups": {
          name: 'smGroups',
          type: 'Array&lt;any&gt;'
        },
        "linked": {
          name: 'linked',
          type: 'any'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "registerUserId": {
          name: 'registerUserId',
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
          keyTo: 'socialMediaAccountId'
        },
      }
    }
  }
}
