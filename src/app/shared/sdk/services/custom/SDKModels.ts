/* tslint:disable */
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { Email } from '../../models/Email';
import { RegisterUser } from '../../models/RegisterUser';
import { Campaign } from '../../models/Campaign';
import { Container } from '../../models/Container';
import { SocialMediaAccount } from '../../models/SocialMediaAccount';
import { Post } from '../../models/Post';
import { MediaFileAsset } from '../../models/MediaFileAsset';
import { Tag } from '../../models/Tag';

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
    MediaFileAsset: MediaFileAsset,
    Tag: Tag,
    
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
