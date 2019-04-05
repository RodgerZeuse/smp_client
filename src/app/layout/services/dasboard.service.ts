import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Http, Response, Headers } from '@angular/http';
@Injectable()
export class DashboardService {
     userId:string;
     access_token:string
  constructor(public http: Http) 
    { 

    }




}