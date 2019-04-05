/* tslint:disable */
import {
  RegisterUser
} from '../index';

declare var Object: any;
export interface TaskManagerInterface {
  "title"?: string;
  "description"?: string;
  "reminderType"?: string;
  "dueDate"?: Date;
  "reminder"?: Date;
  "status"?: string;
  "id"?: any;
  "assignUserId"?: any;
  "ownerId"?: any;
  assignUser?: RegisterUser;
}

export class TaskManager implements TaskManagerInterface {
  "title": string;
  "description": string;
  "reminderType": string;
  "dueDate": Date;
  "reminder": Date;
  "status": string;
  "id": any;
  "assignUserId": any;
  "ownerId": any;
  assignUser: RegisterUser;
  constructor(data?: TaskManagerInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `TaskManager`.
   */
  public static getModelName() {
    return "TaskManager";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of TaskManager for dynamic purposes.
  **/
  public static factory(data: TaskManagerInterface): TaskManager{
    return new TaskManager(data);
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
      name: 'TaskManager',
      plural: 'TaskManagers',
      path: 'TaskManagers',
      idName: 'id',
      properties: {
        "title": {
          name: 'title',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "reminderType": {
          name: 'reminderType',
          type: 'string'
        },
        "dueDate": {
          name: 'dueDate',
          type: 'Date'
        },
        "reminder": {
          name: 'reminder',
          type: 'Date'
        },
        "status": {
          name: 'status',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "assignUserId": {
          name: 'assignUserId',
          type: 'any'
        },
        "ownerId": {
          name: 'ownerId',
          type: 'any'
        },
      },
      relations: {
        assignUser: {
          name: 'assignUser',
          type: 'RegisterUser',
          model: 'RegisterUser',
          relationType: 'belongsTo',
                  keyFrom: 'assignUserId',
          keyTo: 'id'
        },
      }
    }
  }
}
