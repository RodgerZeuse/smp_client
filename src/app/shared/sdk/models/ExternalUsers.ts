/* tslint:disable */
import {
  Comments,
  Invites
} from '../index';

declare var Object: any;
export interface ExternalUsersInterface {
  "firstName"?: string;
  "lastName"?: string;
  "email": string;
  "id"?: any;
  "registerUserId"?: any;
  "createdOn"?: Date;
  "updatedAt"?: Date;
  externalUserComments?: Comments[];
  invites?: Invites[];
}

export class ExternalUsers implements ExternalUsersInterface {
  "firstName": string;
  "lastName": string;
  "email": string;
  "id": any;
  "registerUserId": any;
  "createdOn": Date;
  "updatedAt": Date;
  externalUserComments: Comments[];
  invites: Invites[];
  constructor(data?: ExternalUsersInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ExternalUsers`.
   */
  public static getModelName() {
    return "ExternalUsers";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ExternalUsers for dynamic purposes.
  **/
  public static factory(data: ExternalUsersInterface): ExternalUsers{
    return new ExternalUsers(data);
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
      name: 'ExternalUsers',
      plural: 'ExternalUsers',
      path: 'ExternalUsers',
      idName: 'id',
      properties: {
        "firstName": {
          name: 'firstName',
          type: 'string'
        },
        "lastName": {
          name: 'lastName',
          type: 'string'
        },
        "email": {
          name: 'email',
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
        "updatedAt": {
          name: 'updatedAt',
          type: 'Date'
        },
      },
      relations: {
        externalUserComments: {
          name: 'externalUserComments',
          type: 'Comments[]',
          model: 'Comments',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'externalUsersId'
        },
        invites: {
          name: 'invites',
          type: 'Invites[]',
          model: 'Invites',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'externalUsersId'
        },
      }
    }
  }
}
