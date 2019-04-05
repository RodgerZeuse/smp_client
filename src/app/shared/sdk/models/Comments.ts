/* tslint:disable */
import {
  RegisterUser,
  ExternalUsers
} from '../index';

declare var Object: any;
export interface CommentsInterface {
  "msg": string;
  "id"?: any;
  "registerUserId"?: any;
  "campaignId"?: any;
  "postId"?: any;
  "createdOn"?: Date;
  "updatedAt"?: Date;
  "ancestors"?: Array<any>;
  "parent"?: any;
  "children"?: Array<any>;
  "depth"?: number;
  "orderBy"?: number;
  "externalUsersId"?: any;
  "campaignArchiveId"?: any;
  registerUser?: RegisterUser;
  externalUsers?: ExternalUsers;
}

export class Comments implements CommentsInterface {
  "msg": string;
  "id": any;
  "registerUserId": any;
  "campaignId": any;
  "postId": any;
  "createdOn": Date;
  "updatedAt": Date;
  "ancestors": Array<any>;
  "parent": any;
  "children": Array<any>;
  "depth": number;
  "orderBy": number;
  "externalUsersId": any;
  "campaignArchiveId": any;
  registerUser: RegisterUser;
  externalUsers: ExternalUsers;
  constructor(data?: CommentsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Comments`.
   */
  public static getModelName() {
    return "Comments";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Comments for dynamic purposes.
  **/
  public static factory(data: CommentsInterface): Comments{
    return new Comments(data);
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
      name: 'Comments',
      plural: 'Comments',
      path: 'Comments',
      idName: 'id',
      properties: {
        "msg": {
          name: 'msg',
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
        "campaignId": {
          name: 'campaignId',
          type: 'any'
        },
        "postId": {
          name: 'postId',
          type: 'any'
        },
        "createdOn": {
          name: 'createdOn',
          type: 'Date'
        },
        "updatedAt": {
          name: 'updatedAt',
          type: 'Date'
        },
        "ancestors": {
          name: 'ancestors',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "parent": {
          name: 'parent',
          type: 'any'
        },
        "children": {
          name: 'children',
          type: 'Array&lt;any&gt;'
        },
        "depth": {
          name: 'depth',
          type: 'number'
        },
        "orderBy": {
          name: 'orderBy',
          type: 'number'
        },
        "externalUsersId": {
          name: 'externalUsersId',
          type: 'any'
        },
        "campaignArchiveId": {
          name: 'campaignArchiveId',
          type: 'any'
        },
      },
      relations: {
        registerUser: {
          name: 'registerUser',
          type: 'RegisterUser',
          model: 'RegisterUser',
          relationType: 'belongsTo',
                  keyFrom: 'registerUserId',
          keyTo: 'id'
        },
        externalUsers: {
          name: 'externalUsers',
          type: 'ExternalUsers',
          model: 'ExternalUsers',
          relationType: 'belongsTo',
                  keyFrom: 'externalUsersId',
          keyTo: 'id'
        },
      }
    }
  }
}
