/* tslint:disable */
import {
  SocialMediaAccount,
  RegisterUser
} from '../index';

declare var Object: any;
export interface CompanyMemberSocialAccountInterface {
  "companyAdminId"?: string;
  "id"?: any;
  "socialMediaAccountsId"?: Array<any>;
  "companyMemberId"?: Array<any>;
  companyMemberAccounts?: SocialMediaAccount[];
  companyMemberIds?: RegisterUser[];
}

export class CompanyMemberSocialAccount implements CompanyMemberSocialAccountInterface {
  "companyAdminId": string;
  "id": any;
  "socialMediaAccountsId": Array<any>;
  "companyMemberId": Array<any>;
  companyMemberAccounts: SocialMediaAccount[];
  companyMemberIds: RegisterUser[];
  constructor(data?: CompanyMemberSocialAccountInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `CompanyMemberSocialAccount`.
   */
  public static getModelName() {
    return "CompanyMemberSocialAccount";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of CompanyMemberSocialAccount for dynamic purposes.
  **/
  public static factory(data: CompanyMemberSocialAccountInterface): CompanyMemberSocialAccount{
    return new CompanyMemberSocialAccount(data);
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
      name: 'CompanyMemberSocialAccount',
      plural: 'companyMemberSocialAccounts',
      path: 'companyMemberSocialAccounts',
      idName: 'id',
      properties: {
        "companyAdminId": {
          name: 'companyAdminId',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "socialMediaAccountsId": {
          name: 'socialMediaAccountsId',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "companyMemberId": {
          name: 'companyMemberId',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
      },
      relations: {
        companyMemberAccounts: {
          name: 'companyMemberAccounts',
          type: 'SocialMediaAccount[]',
          model: 'SocialMediaAccount',
          relationType: 'referencesMany',
                  keyFrom: 'socialMediaAccountsId',
          keyTo: 'id'
        },
        companyMemberIds: {
          name: 'companyMemberIds',
          type: 'RegisterUser[]',
          model: 'RegisterUser',
          relationType: 'referencesMany',
                  keyFrom: 'companyMemberId',
          keyTo: 'id'
        },
      }
    }
  }
}
