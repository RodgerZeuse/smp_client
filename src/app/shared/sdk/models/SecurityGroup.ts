/* tslint:disable */
import {
  RegisterUser,
  SystemPermissions
} from '../index';

declare var Object: any;
export interface SecurityGroupInterface {
  "name"?: string;
  "id"?: any;
  "systemsPermissions"?: Array<any>;
  "companyId"?: any;
  registersUsers?: RegisterUser[];
  Rights?: SystemPermissions[];
}

export class SecurityGroup implements SecurityGroupInterface {
  "name": string;
  "id": any;
  "systemsPermissions": Array<any>;
  "companyId": any;
  registersUsers: RegisterUser[];
  Rights: SystemPermissions[];
  constructor(data?: SecurityGroupInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `SecurityGroup`.
   */
  public static getModelName() {
    return "SecurityGroup";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of SecurityGroup for dynamic purposes.
  **/
  public static factory(data: SecurityGroupInterface): SecurityGroup{
    return new SecurityGroup(data);
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
      name: 'SecurityGroup',
      plural: 'SecurityGroups',
      path: 'SecurityGroups',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "systemsPermissions": {
          name: 'systemsPermissions',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "companyId": {
          name: 'companyId',
          type: 'any'
        },
      },
      relations: {
        registersUsers: {
          name: 'registersUsers',
          type: 'RegisterUser[]',
          model: 'RegisterUser',
          relationType: 'hasMany',
          modelThrough: 'SecurityGroupRegisterUser',
          keyThrough: 'registerUserId',
          keyFrom: 'id',
          keyTo: 'securityGroupId'
        },
        Rights: {
          name: 'Rights',
          type: 'SystemPermissions[]',
          model: 'SystemPermissions',
          relationType: 'referencesMany',
                  keyFrom: 'systemsPermissions',
          keyTo: 'id'
        },
      }
    }
  }
}
