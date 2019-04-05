/* tslint:disable */

declare var Object: any;
export interface PaymentsInterface {
  "paymentMethod": string;
  "transaction": any;
  "amount": number;
  "id"?: any;
  "registerUserId"?: any;
  "createdOn": Date;
  "updatedOn": Date;
}

export class Payments implements PaymentsInterface {
  "paymentMethod": string;
  "transaction": any;
  "amount": number;
  "id": any;
  "registerUserId": any;
  "createdOn": Date;
  "updatedOn": Date;
  constructor(data?: PaymentsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Payments`.
   */
  public static getModelName() {
    return "Payments";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Payments for dynamic purposes.
  **/
  public static factory(data: PaymentsInterface): Payments{
    return new Payments(data);
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
      name: 'Payments',
      plural: 'Payments',
      path: 'Payments',
      idName: 'id',
      properties: {
        "paymentMethod": {
          name: 'paymentMethod',
          type: 'string'
        },
        "transaction": {
          name: 'transaction',
          type: 'any'
        },
        "amount": {
          name: 'amount',
          type: 'number'
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
      }
    }
  }
}
