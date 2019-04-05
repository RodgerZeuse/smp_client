/* tslint:disable */
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { Email } from '../../models/Email';
import { RegisterUser } from '../../models/RegisterUser';
import { Campaign } from '../../models/Campaign';
import { Container } from '../../models/Container';
import { SocialMediaAccount } from '../../models/SocialMediaAccount';
import { Post } from '../../models/Post';
import { CompanyMemberSocialAccount } from '../../models/CompanyMemberSocialAccount';
import { ActivityStream } from '../../models/ActivityStream';
import { MediaFileAsset } from '../../models/MediaFileAsset';
import { Comments } from '../../models/Comments';
import { Tag } from '../../models/Tag';
import { Company } from '../../models/Company';
import { PostToQueue } from '../../models/PostToQueue';
import { CampaignStatus } from '../../models/CampaignStatus';
import { Slot } from '../../models/Slot';
import { SingleUser } from '../../models/SingleUser';
import { SlotTime } from '../../models/SlotTime';
import { CampaignStatusValues } from '../../models/CampaignStatusValues';
import { SystemPermissions } from '../../models/SystemPermissions';
import { SecurityGroup } from '../../models/SecurityGroup';
import { ExternalUsers } from '../../models/ExternalUsers';
import { Invites } from '../../models/Invites';
import { TaskManager } from '../../models/TaskManager';
import { PostAnalytics } from '../../models/PostAnalytics';
import { Payments } from '../../models/Payments';
import { PaymentGateway } from '../../models/PaymentGateway';
import { CampaignArchive } from '../../models/CampaignArchive';
import { PostArchive } from '../../models/PostArchive';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    User: User,
    Email: Email,
    RegisterUser: RegisterUser,
    Campaign: Campaign,
    Container: Container,
    SocialMediaAccount: SocialMediaAccount,
    Post: Post,
    CompanyMemberSocialAccount: CompanyMemberSocialAccount,
    ActivityStream: ActivityStream,
    MediaFileAsset: MediaFileAsset,
    Comments: Comments,
    Tag: Tag,
    Company: Company,
    PostToQueue: PostToQueue,
    CampaignStatus: CampaignStatus,
    Slot: Slot,
    SingleUser: SingleUser,
    SlotTime: SlotTime,
    CampaignStatusValues: CampaignStatusValues,
    SystemPermissions: SystemPermissions,
    SecurityGroup: SecurityGroup,
    ExternalUsers: ExternalUsers,
    Invites: Invites,
    TaskManager: TaskManager,
    PostAnalytics: PostAnalytics,
    Payments: Payments,
    PaymentGateway: PaymentGateway,
    CampaignArchive: CampaignArchive,
    PostArchive: PostArchive,
    
  };

  public get(modelName: string): any {
    return this.models[modelName];
  }

  public getAll(): Models {
    return this.models;
  }

  public getModelNames(): string[] {
    return Object.keys(this.models);
  }
}
