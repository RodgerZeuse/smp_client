import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Headers, Http } from '@angular/http';
import { CampaignApi } from '../../shared/sdk';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ExternalService {

    constructor(public httpClient: HttpClient, public http: Http, private campaign: CampaignApi) {
    }

    getFileContentFormBox(fileId, accessToken) {
        let header = new Headers({ "Authorization": "Bearer " + accessToken });
        return this.http.get("https://api.box.com/2.0/files/" + fileId + "/content", {
            headers: header
        }).map(res => {
            return res;
        })
    }

    getAccessTocken(code: string): Observable<string> {
        return this.campaign.boxAccessTokenFetch(code).map(res => {
            return res;
        })
    }

    
    getFile(url: string, name: string) {
        return this.campaign.downloadImage(url, name).map(res => {
            return res;
        })
    }

    authenticateUser(clientId: String, clientSecret) {
        return this.campaign.boxAuthorization().map(res => {
            return res;
        }, err => {
            console.log(err)
        });
    }
}