/* tslint:disable */
import {
  RegisterUser
} from '../index';

declare var Object: any;
export interface SingleUserInterface {
  "name"?: string;
  "address"?: string;
  "id"?: any;
  "registerUserId"?: any;
  registerUser?: RegisterUser;
}

export class SingleUser implements SingleUserInterface {
  "name": string;
  "address": string;
  "id": any;
  "registerUserId": any;
  registerUser: RegisterUser;
  constructor(data?: SingleUserInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `SingleUser`.
   */
  public static getModelName() {
    return "SingleUser";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of SingleUser for dynamic purposes.
  **/
  public static factory(data: SingleUserInterface): SingleUser{
    return new SingleUser(data);
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
      name: 'SingleUser',
      plural: 'SingleUsers',
      path: 'SingleUsers',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "address": {
          name: 'address',
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
