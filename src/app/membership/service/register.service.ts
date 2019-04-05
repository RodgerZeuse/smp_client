import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { RegisterUser, RegisterUserApi } from '../../shared/sdk';

@Injectable({
  providedIn: 'root'
})

export class RegisterService {

  constructor(private userApi: RegisterUserApi) {
  }

  public registerUser(user: RegisterUser): Observable<boolean> {
    return this.userApi.create(user).map(us => {
      return true;
    });

  }
  public validateEmail(email: string): Observable<boolean> {
    return this.userApi.validateEmail(email).map(responce => {
      return responce;
    })
  }
  public validateCompany(companyName: string): Observable<boolean> {
    return this.userApi.validateCompany(companyName).map(responce => {
      return responce;
    })
  }
}