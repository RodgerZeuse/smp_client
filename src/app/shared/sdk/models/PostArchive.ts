/* tslint:disable */

declare var Object: any;
export interface PostArchiveInterface {
  "scheduleDate"?: Date;
  "socialMediaInfo"?: any;
  "network"?: string;
  "error"?: string;
  "name"?: string;
  "state"?: string;
  "description"?: string;
  "id"?: any;
  "registerUserId"?: any;
  "campaignArchiveId"?: any;
}

export class PostArchive implements PostArchiveInterface {
  "scheduleDate": Date;
  "socialMediaInfo": any;
  "network": string;
  "error": string;
  "name": string;
  "state": string;
  "description": string;
  "id": any;
  "registerUserId": any;
  "campaignArchiveId": any;
  constructor(data?: PostArchiveInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PostArchive`.
   */
  public static getModelName() {
    return "PostArchive";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PostArchive for dynamic purposes.
  **/
  public static factory(data: PostArchiveInterface): PostArchive{
    return new PostArchive(data);
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
      name: 'PostArchive',
      plural: 'PostArchives',
      path: 'PostArchives',
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
        "id": {
          name: 'id',
          type: 'any'
        },
        "registerUserId": {
          name: 'registerUserId',
          type: 'any'
        },
        "campaignArchiveId": {
          name: 'campaignArchiveId',
          type: 'any'
        },
      },
      relations: {
      }
    }
  }
}
