/* tslint:disable */
import {
  RegisterUser
} from '../index';

declare var Object: any;
export interface ActivityStreamInterface {
  "who"?: string;
  "what"?: string;
  "when"?: string;
  "where"?: string;
  "beforeState"?: any;
  "changeState"?: any;
  "afterState"?: any;
  "companyMessage"?: string;
  "id"?: any;
  "registerUserId"?: any;
  "createdOn": Date;
  "updatedOn": Date;
  registerUser?: RegisterUser;
}

export class ActivityStream implements ActivityStreamInterface {
  "who": string;
  "what": string;
  "when": string;
  "where": string;
  "beforeState": any;
  "changeState": any;
  "afterState": any;
  "companyMessage": string;
  "id": any;
  "registerUserId": any;
  "createdOn": Date;
  "updatedOn": Date;
  registerUser: RegisterUser;
  constructor(data?: ActivityStreamInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ActivityStream`.
   */
  public static getModelName() {
    return "ActivityStream";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ActivityStream for dynamic purposes.
  **/
  public static factory(data: ActivityStreamInterface): ActivityStream{
    return new ActivityStream(data);
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
      name: 'ActivityStream',
      plural: 'activitystreams',
      path: 'activitystreams',
      idName: 'id',
      properties: {
        "who": {
          name: 'who',
          type: 'string'
        },
        "what": {
          name: 'what',
          type: 'string'
        },
        "when": {
          name: 'when',
          type: 'string'
        },
        "where": {
          name: 'where',
          type: 'string'
        },
        "beforeState": {
          name: 'beforeState',
          type: 'any'
        },
        "changeState": {
          name: 'changeState',
          type: 'any'
        },
        "afterState": {
          name: 'afterState',
          type: 'any'
        },
        "companyMessage": {
          name: 'companyMessage',
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
      }
    }
  }
}
