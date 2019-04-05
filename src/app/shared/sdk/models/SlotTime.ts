/* tslint:disable */

declare var Object: any;
export interface SlotTimeInterface {
  "hour"?: number;
  "min"?: number;
  "id"?: string;
}

export class SlotTime implements SlotTimeInterface {
  "hour": number;
  "min": number;
  "id": string;
  constructor(data?: SlotTimeInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `SlotTime`.
   */
  public static getModelName() {
    return "SlotTime";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of SlotTime for dynamic purposes.
  **/
  public static factory(data: SlotTimeInterface): SlotTime{
    return new SlotTime(data);
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
      name: 'SlotTime',
      plural: 'SlotTimes',
      path: 'SlotTimes',
      idName: 'id',
      properties: {
        "hour": {
          name: 'hour',
          type: 'number'
        },
        "min": {
          name: 'min',
          type: 'number'
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
