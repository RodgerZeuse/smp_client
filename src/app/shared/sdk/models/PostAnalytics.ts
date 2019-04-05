/* tslint:disable */

declare var Object: any;
export interface PostAnalyticsInterface {
  "postDetails"?: Array<any>;
  "socialMediaPostId"?: string;
  "id"?: any;
  "postId"?: any;
}

export class PostAnalytics implements PostAnalyticsInterface {
  "postDetails": Array<any>;
  "socialMediaPostId": string;
  "id": any;
  "postId": any;
  constructor(data?: PostAnalyticsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PostAnalytics`.
   */
  public static getModelName() {
    return "PostAnalytics";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PostAnalytics for dynamic purposes.
  **/
  public static factory(data: PostAnalyticsInterface): PostAnalytics{
    return new PostAnalytics(data);
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
      name: 'PostAnalytics',
      plural: 'PostAnalytics',
      path: 'PostAnalytics',
      idName: 'id',
      properties: {
        "postDetails": {
          name: 'postDetails',
          type: 'Array&lt;any&gt;'
        },
        "socialMediaPostId": {
          name: 'socialMediaPostId',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "postId": {
          name: 'postId',
          type: 'any'
        },
      },
      relations: {
      }
    }
  }
}
