/* tslint:disable */
import {
  Campaign,
  SocialMediaAccount,
  Post,
  ActivityStream,
  Comments,
  Company,
  PostToQueue,
  CampaignStatus,
  SingleUser,
  SecurityGroup,
  ExternalUsers,
  Invites,
  TaskManager,
  Payments,
  CampaignArchive,
  PostArchive
} from '../index';

declare var Object: any;
export interface RegisterUserInterface {
  "firstName"?: string;
  "lastName"?: string;
  "companyName"?: string;
  "cardNumber"?: string;
  "cardCvv"?: number;
  "expiryDate"?: number;
  "account_type": string;
  "profileImage"?: string;
  "hasCompany"?: boolean;
  "realm"?: string;
  "username"?: string;
  "email": string;
  "emailVerified"?: boolean;
  "id"?: any;
  "registerUserId"?: any;
  "companyId"?: any;
  "companyMembersId"?: any;
  "password"?: string;
  accessTokens?: any[];
  teamMembers?: RegisterUser[];
  campaigns?: Campaign[];
  socialAccounts?: SocialMediaAccount[];
  posts?: Post[];
  activities?: ActivityStream[];
  registerUserComments?: Comments[];
  myCompany?: Company;
  companyMembers?: Company;
  postToQueues?: PostToQueue;
  campaignStatuses?: CampaignStatus[];
  singleUsers?: SingleUser;
  securityGroups?: SecurityGroup[];
  appExternalUser?: ExternalUsers;
  invites?: Invites[];
  taskManagers?: TaskManager[];
  userPayments?: Payments[];
  campaignsArchive?: CampaignArchive[];
  postsArchive?: PostArchive[];
}

export class RegisterUser implements RegisterUserInterface {
  "firstName": string;
  "lastName": string;
  "companyName": string;
  "cardNumber": string;
  "cardCvv": number;
  "expiryDate": number;
  "account_type": string;
  "profileImage": string;
  "hasCompany": boolean;
  "realm": string;
  "username": string;
  "email": string;
  "emailVerified": boolean;
  "id": any;
  "registerUserId": any;
  "companyId": any;
  "companyMembersId": any;
  "password": string;
  accessTokens: any[];
  teamMembers: RegisterUser[];
  campaigns: Campaign[];
  socialAccounts: SocialMediaAccount[];
  posts: Post[];
  activities: ActivityStream[];
  registerUserComments: Comments[];
  myCompany: Company;
  companyMembers: Company;
  postToQueues: PostToQueue;
  campaignStatuses: CampaignStatus[];
  singleUsers: SingleUser;
  securityGroups: SecurityGroup[];
  appExternalUser: ExternalUsers;
  invites: Invites[];
  taskManagers: TaskManager[];
  userPayments: Payments[];
  campaignsArchive: CampaignArchive[];
  postsArchive: PostArchive[];
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
        "companyName": {
          name: 'companyName',
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
        "account_type": {
          name: 'account_type',
          type: 'string'
        },
        "profileImage": {
          name: 'profileImage',
          type: 'string'
        },
        "hasCompany": {
          name: 'hasCompany',
          type: 'boolean'
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
        "registerUserId": {
          name: 'registerUserId',
          type: 'any'
        },
        "companyId": {
          name: 'companyId',
          type: 'any'
        },
        "companyMembersId": {
          name: 'companyMembersId',
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
        teamMembers: {
          name: 'teamMembers',
          type: 'RegisterUser[]',
          model: 'RegisterUser',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'registerUserId'
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
        activities: {
          name: 'activities',
          type: 'ActivityStream[]',
          model: 'ActivityStream',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'registerUserId'
        },
        registerUserComments: {
          name: 'registerUserComments',
          type: 'Comments[]',
          model: 'Comments',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'registerUserId'
        },
        myCompany: {
          name: 'myCompany',
          type: 'Company',
          model: 'Company',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'registerUserId'
        },
        companyMembers: {
          name: 'companyMembers',
          type: 'Company',
          model: 'Company',
          relationType: 'belongsTo',
                  keyFrom: 'companyMembersId',
          keyTo: 'id'
        },
        postToQueues: {
          name: 'postToQueues',
          type: 'PostToQueue',
          model: 'PostToQueue',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'registerUserId'
        },
        campaignStatuses: {
          name: 'campaignStatuses',
          type: 'CampaignStatus[]',
          model: 'CampaignStatus',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'registerUserId'
        },
        singleUsers: {
          name: 'singleUsers',
          type: 'SingleUser',
          model: 'SingleUser',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'registerUserId'
        },
        securityGroups: {
          name: 'securityGroups',
          type: 'SecurityGroup[]',
          model: 'SecurityGroup',
          relationType: 'hasMany',
          modelThrough: 'SecurityGroupRegisterUser',
          keyThrough: 'securityGroupId',
          keyFrom: 'id',
          keyTo: 'registerUserId'
        },
        appExternalUser: {
          name: 'appExternalUser',
          type: 'ExternalUsers',
          model: 'ExternalUsers',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'registerUserId'
        },
        invites: {
          name: 'invites',
          type: 'Invites[]',
          model: 'Invites',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'registerUserId'
        },
        taskManagers: {
          name: 'taskManagers',
          type: 'TaskManager[]',
          model: 'TaskManager',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'ownerId'
        },
        userPayments: {
          name: 'userPayments',
          type: 'Payments[]',
          model: 'Payments',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'registerUserId'
        },
        campaignsArchive: {
          name: 'campaignsArchive',
          type: 'CampaignArchive[]',
          model: 'CampaignArchive',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'registerUserId'
        },
        postsArchive: {
          name: 'postsArchive',
          type: 'PostArchive[]',
          model: 'PostArchive',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'registerUserId'
        },
      }
    }
  }
}
