/* tslint:disable */

declare var Object: any;
export interface SlotInterface {
  "isAvailable"?: boolean;
  "from"?: any;
  "to"?: any;
  "isAvailableForCampaign"?: boolean;
  "id"?: string;
}

export class Slot implements SlotInterface {
  "isAvailable": boolean;
  "from": any;
  "to": any;
  "isAvailableForCampaign": boolean;
  "id": string;
  constructor(data?: SlotInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Slot`.
   */
  public static getModelName() {
    return "Slot";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Slot for dynamic purposes.
  **/
  public static factory(data: SlotInterface): Slot{
    return new Slot(data);
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
      name: 'Slot',
      plural: 'Slots',
      path: 'Slots',
      idName: 'id',
      properties: {
        "isAvailable": {
          name: 'isAvailable',
          type: 'boolean',
          default: true
        },
        "from": {
          name: 'from',
          type: 'any'
        },
        "to": {
          name: 'to',
          type: 'any'
        },
        "isAvailableForCampaign": {
          name: 'isAvailableForCampaign',
          type: 'boolean',
          default: true
        },
        "id": {
          name: 'id',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
