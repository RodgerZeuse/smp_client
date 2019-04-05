/* tslint:disable */
import {
  Tag
} from '../index';

declare var Object: any;
export interface MediaFileAssetInterface {
  "name"?: string;
  "originalFilename"?: string;
  "type"?: string;
  "isCropped"?: boolean;
  "thumbnail"?: string;
  "network"?: string;
  "id"?: string;
  "tags"?: Array<any>;
  tag?: Tag[];
}

export class MediaFileAsset implements MediaFileAssetInterface {
  "name": string;
  "originalFilename": string;
  "type": string;
  "isCropped": boolean;
  "thumbnail": string;
  "network": string;
  "id": string;
  "tags": Array<any>;
  tag: Tag[];
  constructor(data?: MediaFileAssetInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `MediaFileAsset`.
   */
  public static getModelName() {
    return "MediaFileAsset";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of MediaFileAsset for dynamic purposes.
  **/
  public static factory(data: MediaFileAssetInterface): MediaFileAsset{
    return new MediaFileAsset(data);
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
      name: 'MediaFileAsset',
      plural: 'mediaFilesAssests',
      path: 'mediaFilesAssests',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "originalFilename": {
          name: 'originalFilename',
          type: 'string'
        },
        "type": {
          name: 'type',
          type: 'string'
        },
        "isCropped": {
          name: 'isCropped',
          type: 'boolean'
        },
        "thumbnail": {
          name: 'thumbnail',
          type: 'string'
        },
        "network": {
          name: 'network',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'string'
        },
        "tags": {
          name: 'tags',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
      },
      relations: {
        tag: {
          name: 'tag',
          type: 'Tag[]',
          model: 'Tag',
          relationType: 'embedsMany',
                  keyFrom: 'tags',
          keyTo: 'id'
        },
      }
    }
  }
}
