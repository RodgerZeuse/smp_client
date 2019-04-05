/* tslint:disable */
import {
  SecurityGroup
} from '../index';

declare var Object: any;
export interface SystemPermissionsInterface {
  "key"?: string;
  "desc"?: string;
  "id"?: any;
  "securityGroupId"?: any;
  securityGroup?: SecurityGroup;
}

export class SystemPermissions implements SystemPermissionsInterface {
  "key": string;
  "desc": string;
  "id": any;
  "securityGroupId": any;
  securityGroup: SecurityGroup;
  constructor(data?: SystemPermissionsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `SystemPermissions`.
   */
  public static getModelName() {
    return "SystemPermissions";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of SystemPermissions for dynamic purposes.
  **/
  public static factory(data: SystemPermissionsInterface): SystemPermissions{
    return new SystemPermissions(data);
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
      name: 'SystemPermissions',
      plural: 'SystemPermissions',
      path: 'SystemPermissions',
      idName: 'id',
      properties: {
        "key": {
          name: 'key',
          type: 'string'
        },
        "desc": {
          name: 'desc',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "securityGroupId": {
          name: 'securityGroupId',
          type: 'any'
        },
      },
      relations: {
        securityGroup: {
          name: 'securityGroup',
          type: 'SecurityGroup',
          model: 'SecurityGroup',
          relationType: 'belongsTo',
                  keyFrom: 'securityGroupId',
          keyTo: 'id'
        },
      }
    }
  }
}
