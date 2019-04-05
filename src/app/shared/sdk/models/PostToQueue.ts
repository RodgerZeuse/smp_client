/* tslint:disable */
import {
  Slot
} from '../index';

declare var Object: any;
export interface PostToQueueInterface {
  "id"?: any;
  "registerUserId"?: any;
  "Monday"?: Array<any>;
  "Tuesday"?: Array<any>;
  "Wednesday"?: Array<any>;
  "Thursday"?: Array<any>;
  "Friday"?: Array<any>;
  "Saturday"?: Array<any>;
  "Sunday"?: Array<any>;
  MO?: Slot[];
  TU?: Slot[];
  WE?: Slot[];
  TH?: Slot[];
  FR?: Slot[];
  SA?: Slot[];
  SU?: Slot[];
}

export class PostToQueue implements PostToQueueInterface {
  "id": any;
  "registerUserId": any;
  "Monday": Array<any>;
  "Tuesday": Array<any>;
  "Wednesday": Array<any>;
  "Thursday": Array<any>;
  "Friday": Array<any>;
  "Saturday": Array<any>;
  "Sunday": Array<any>;
  MO: Slot[];
  TU: Slot[];
  WE: Slot[];
  TH: Slot[];
  FR: Slot[];
  SA: Slot[];
  SU: Slot[];
  constructor(data?: PostToQueueInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PostToQueue`.
   */
  public static getModelName() {
    return "PostToQueue";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PostToQueue for dynamic purposes.
  **/
  public static factory(data: PostToQueueInterface): PostToQueue{
    return new PostToQueue(data);
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
      name: 'PostToQueue',
      plural: 'PostToQueues',
      path: 'PostToQueues',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'any'
        },
        "registerUserId": {
          name: 'registerUserId',
          type: 'any'
        },
        "Monday": {
          name: 'Monday',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "Tuesday": {
          name: 'Tuesday',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "Wednesday": {
          name: 'Wednesday',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "Thursday": {
          name: 'Thursday',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "Friday": {
          name: 'Friday',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "Saturday": {
          name: 'Saturday',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "Sunday": {
          name: 'Sunday',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
      },
      relations: {
        MO: {
          name: 'MO',
          type: 'Slot[]',
          model: 'Slot',
          relationType: 'embedsMany',
                  keyFrom: 'Monday',
          keyTo: 'id'
        },
        TU: {
          name: 'TU',
          type: 'Slot[]',
          model: 'Slot',
          relationType: 'embedsMany',
                  keyFrom: 'Tuesday',
          keyTo: 'id'
        },
        WE: {
          name: 'WE',
          type: 'Slot[]',
          model: 'Slot',
          relationType: 'embedsMany',
                  keyFrom: 'Wednesday',
          keyTo: 'id'
        },
        TH: {
          name: 'TH',
          type: 'Slot[]',
          model: 'Slot',
          relationType: 'embedsMany',
                  keyFrom: 'Thursday',
          keyTo: 'id'
        },
        FR: {
          name: 'FR',
          type: 'Slot[]',
          model: 'Slot',
          relationType: 'embedsMany',
                  keyFrom: 'Friday',
          keyTo: 'id'
        },
        SA: {
          name: 'SA',
          type: 'Slot[]',
          model: 'Slot',
          relationType: 'embedsMany',
                  keyFrom: 'Saturday',
          keyTo: 'id'
        },
        SU: {
          name: 'SU',
          type: 'Slot[]',
          model: 'Slot',
          relationType: 'embedsMany',
                  keyFrom: 'Sunday',
          keyTo: 'id'
        },
      }
    }
  }
}
