/* tslint:disable */

declare var Object: any;
export interface TagInterface {
  "tag_text"?: string;
  "x"?: string;
  "y"?: string;
  "id"?: string;
}

export class Tag implements TagInterface {
  "tag_text": string;
  "x": string;
  "y": string;
  "id": string;
  constructor(data?: TagInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Tag`.
   */
  public static getModelName() {
    return "Tag";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Tag for dynamic purposes.
  **/
  public static factory(data: TagInterface): Tag{
    return new Tag(data);
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
      name: 'Tag',
      plural: 'tags',
      path: 'tags',
      idName: 'id',
      properties: {
        "tag_text": {
          name: 'tag_text',
          type: 'string'
        },
        "x": {
          name: 'x',
          type: 'string'
        },
        "y": {
          name: 'y',
          type: 'string'
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
