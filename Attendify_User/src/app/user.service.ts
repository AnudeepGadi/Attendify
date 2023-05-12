import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { ClientJS } from 'clientjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private BASE_URL = 'https://6f3865y570.execute-api.us-east-1.amazonaws.com/dev/user';
  
  constructor(private http : HttpClient, private cookieService:CookieService) {}

  getUserInitialData(): Observable<any> {
    const token = this.cookieService.get('id_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const options = { headers: headers };
    const response = this.http.get<any>(`${this.BASE_URL}/initial`, options);
    return response;
  }

  markAttendance(access_code:String):Observable<any>{
    const token = this.cookieService.get('id_token');
    const client = new ClientJS();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const options = { headers: headers };
    const data = {access_code:access_code,deviceIdentifier:client.getFingerprint().toString()}
    const response = this.http.post<any>(`${this.BASE_URL}/markattendance`,data,options);
    return response;
  }
}
