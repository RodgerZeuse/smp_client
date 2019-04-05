/* tslint:disable */

declare var Object: any;
export interface CampaignStatusValuesInterface {
  "label"?: string;
  "color"?: string;
  "isPublish"?: boolean;
  "id"?: string;
}

export class CampaignStatusValues implements CampaignStatusValuesInterface {
  "label": string;
  "color": string;
  "isPublish": boolean;
  "id": string;
  constructor(data?: CampaignStatusValuesInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `CampaignStatusValues`.
   */
  public static getModelName() {
    return "CampaignStatusValues";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of CampaignStatusValues for dynamic purposes.
  **/
  public static factory(data: CampaignStatusValuesInterface): CampaignStatusValues{
    return new CampaignStatusValues(data);
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
      name: 'CampaignStatusValues',
      plural: 'CampaignStatusValues',
      path: 'CampaignStatusValues',
      idName: 'id',
      properties: {
        "label": {
          name: 'label',
          type: 'string'
        },
        "color": {
          name: 'color',
          type: 'string'
        },
        "isPublish": {
          name: 'isPublish',
          type: 'boolean'
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
