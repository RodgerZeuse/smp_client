/* tslint:disable */
import {
  RegisterUser
} from '../index';

declare var Object: any;
export interface PaymentGatewayInterface {
  "email": string;
  "tokenId": string;
  "paymentInfo": any;
  "id"?: any;
  "registerUserId"?: any;
  "createdOn": Date;
  "updatedOn": Date;
  registerUser?: RegisterUser;
}

export class PaymentGateway implements PaymentGatewayInterface {
  "email": string;
  "tokenId": string;
  "paymentInfo": any;
  "id": any;
  "registerUserId": any;
  "createdOn": Date;
  "updatedOn": Date;
  registerUser: RegisterUser;
  constructor(data?: PaymentGatewayInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PaymentGateway`.
   */
  public static getModelName() {
    return "PaymentGateway";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PaymentGateway for dynamic purposes.
  **/
  public static factory(data: PaymentGatewayInterface): PaymentGateway{
    return new PaymentGateway(data);
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
      name: 'PaymentGateway',
      plural: 'PaymentGateways',
      path: 'PaymentGateways',
      idName: 'id',
      properties: {
        "email": {
          name: 'email',
          type: 'string'
        },
        "tokenId": {
          name: 'tokenId',
          type: 'string'
        },
        "paymentInfo": {
          name: 'paymentInfo',
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
