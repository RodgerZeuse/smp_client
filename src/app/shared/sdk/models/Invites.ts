/* tslint:disable */

declare var Object: any;
export interface InvitesInterface {
  "token"?: string;
  "isExpire"?: string;
  "isAccepted"?: string;
  "url"?: string;
  "inviteType"?: string;
  "id"?: any;
  "registerUserId"?: any;
  "campaignId"?: any;
  "externalUsersId"?: any;
  "campaignArchiveId"?: any;
}

export class Invites implements InvitesInterface {
  "token": string;
  "isExpire": string;
  "isAccepted": string;
  "url": string;
  "inviteType": string;
  "id": any;
  "registerUserId": any;
  "campaignId": any;
  "externalUsersId": any;
  "campaignArchiveId": any;
  constructor(data?: InvitesInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Invites`.
   */
  public static getModelName() {
    return "Invites";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Invites for dynamic purposes.
  **/
  public static factory(data: InvitesInterface): Invites{
    return new Invites(data);
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
      name: 'Invites',
      plural: 'Invites',
      path: 'Invites',
      idName: 'id',
      properties: {
        "token": {
          name: 'token',
          type: 'string'
        },
        "isExpire": {
          name: 'isExpire',
          type: 'string'
        },
        "isAccepted": {
          name: 'isAccepted',
          type: 'string'
        },
        "url": {
          name: 'url',
          type: 'string'
        },
        "inviteType": {
          name: 'inviteType',
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
      }
    }
  }
}
