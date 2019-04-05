/* tslint:disable */
import {
  RegisterUser,
  Campaign,
  SecurityGroup
} from '../index';

declare var Object: any;
export interface CompanyInterface {
  "name"?: string;
  "address"?: string;
  "id"?: any;
  "registerUserId"?: any;
  registerUsers?: RegisterUser[];
  companyAdmin?: RegisterUser;
  campaigns?: Campaign[];
  securityGroups?: SecurityGroup[];
}

export class Company implements CompanyInterface {
  "name": string;
  "address": string;
  "id": any;
  "registerUserId": any;
  registerUsers: RegisterUser[];
  companyAdmin: RegisterUser;
  campaigns: Campaign[];
  securityGroups: SecurityGroup[];
  constructor(data?: CompanyInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Company`.
   */
  public static getModelName() {
    return "Company";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Company for dynamic purposes.
  **/
  public static factory(data: CompanyInterface): Company{
    return new Company(data);
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
      name: 'Company',
      plural: 'companies',
      path: 'companies',
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
        registerUsers: {
          name: 'registerUsers',
          type: 'RegisterUser[]',
          model: 'RegisterUser',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'companyId'
        },
        companyAdmin: {
          name: 'companyAdmin',
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
          keyTo: 'companyId'
        },
        securityGroups: {
          name: 'securityGroups',
          type: 'SecurityGroup[]',
          model: 'SecurityGroup',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'companyId'
        },
      }
    }
  }
}
