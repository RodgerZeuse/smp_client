/* tslint:disable */
import {
  RegisterUser,
  Campaign,
  Post
} from '../index';

declare var Object: any;
export interface CampaignStatusInterface {
  "status"?: any;
  "id"?: any;
  "registerUserId"?: any;
  registerUser?: RegisterUser;
  campaigns?: Campaign[];
  posts?: Post[];
}

export class CampaignStatus implements CampaignStatusInterface {
  "status": any;
  "id": any;
  "registerUserId": any;
  registerUser: RegisterUser;
  campaigns: Campaign[];
  posts: Post[];
  constructor(data?: CampaignStatusInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `CampaignStatus`.
   */
  public static getModelName() {
    return "CampaignStatus";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of CampaignStatus for dynamic purposes.
  **/
  public static factory(data: CampaignStatusInterface): CampaignStatus{
    return new CampaignStatus(data);
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
      name: 'CampaignStatus',
      plural: 'CampaignStatuses',
      path: 'CampaignStatuses',
      idName: 'id',
      properties: {
        "status": {
          name: 'status',
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
        campaigns: {
          name: 'campaigns',
          type: 'Campaign[]',
          model: 'Campaign',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'statusId'
        },
        posts: {
          name: 'posts',
          type: 'Post[]',
          model: 'Post',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'campaignStatusId'
        },
      }
    }
  }
}
