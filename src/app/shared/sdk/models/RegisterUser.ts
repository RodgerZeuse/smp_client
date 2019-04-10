/* tslint:disable */
import {
  Campaign,
  SocialMediaAccount,
  Post
} from '../index';

declare var Object: any;
export interface RegisterUserInterface {
  "firstName"?: string;
  "lastName"?: string;
  "cardNumber"?: string;
  "cardCvv"?: number;
  "expiryDate"?: number;
  "profileImage"?: string;
  "realm"?: string;
  "username"?: string;
  "email": string;
  "emailVerified"?: boolean;
  "id"?: any;
  "password"?: string;
  accessTokens?: any[];
  campaigns?: Campaign[];
  socialAccounts?: SocialMediaAccount[];
  posts?: Post[];
}

export class RegisterUser implements RegisterUserInterface {
  "firstName": string;
  "lastName": string;
  "cardNumber": string;
  "cardCvv": number;
  "expiryDate": number;
  "profileImage": string;
  "realm": string;
  "username": string;
  "email": string;
  "emailVerified": boolean;
  "id": any;
  "password": string;
  accessTokens: any[];
  campaigns: Campaign[];
  socialAccounts: SocialMediaAccount[];
  posts: Post[];
  constructor(data?: RegisterUserInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `RegisterUser`.
   */
  public static getModelName() {
    return "RegisterUser";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of RegisterUser for dynamic purposes.
  **/
  public static factory(data: RegisterUserInterface): RegisterUser{
    return new RegisterUser(data);
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
      name: 'RegisterUser',
      plural: 'registerusers',
      path: 'registerusers',
      idName: 'id',
      properties: {
        "firstName": {
          name: 'firstName',
          type: 'string'
        },
        "lastName": {
          name: 'lastName',
          type: 'string'
        },
        "cardNumber": {
          name: 'cardNumber',
          type: 'string'
        },
        "cardCvv": {
          name: 'cardCvv',
          type: 'number'
        },
        "expiryDate": {
          name: 'expiryDate',
          type: 'number'
        },
        "profileImage": {
          name: 'profileImage',
          type: 'string'
        },
        "realm": {
          name: 'realm',
          type: 'string'
        },
        "username": {
          name: 'username',
          type: 'string'
        },
        "email": {
          name: 'email',
          type: 'string'
        },
        "emailVerified": {
          name: 'emailVerified',
          type: 'boolean'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "password": {
          name: 'password',
          type: 'string'
        },
      },
      relations: {
        accessTokens: {
          name: 'accessTokens',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'userId'
        },
        campaigns: {
          name: 'campaigns',
          type: 'Campaign[]',
          model: 'Campaign',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'registerUserId'
        },
        socialAccounts: {
          name: 'socialAccounts',
          type: 'SocialMediaAccount[]',
          model: 'SocialMediaAccount',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'registerUserId'
        },
        posts: {
          name: 'posts',
          type: 'Post[]',
          model: 'Post',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'registerUserId'
        },
      }
    }
  }
}
