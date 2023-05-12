import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders,HttpParams} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable,Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  private BASE_URL = 'https://6f3865y570.execute-api.us-east-1.amazonaws.com/dev/admin';
  
  private subject = new Subject<any>();

  sendNotification(value: any) {
    this.subject.next(value);
  }

  getNotification() {
    return this.subject.asObservable();
  }

  constructor(private http : HttpClient, private cookieService:CookieService) {}

  getAdminInitialData(): Observable<any> {
    const token = this.cookieService.get('id_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const options = { headers: headers };
    const response = this.http.get<any>(`${this.BASE_URL}/initial`, options);
    return response;
  }

  generateAccessCode(): Observable<any> {
    const token = this.cookieService.get('id_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const options = { headers: headers };
    const response = this.http.get<any>(`${this.BASE_URL}/accesstoken`, options);
    return response;
  }

  changeAccessCodeStatus(access_code_id:string,switch_status:string):Observable<any>{
    const token = this.cookieService.get('id_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const options = { headers: headers };
    const data = {access_code_id:access_code_id,switch:switch_status}
    const response = this.http.put<any>(`${this.BASE_URL}/accesstoken`,data,options);
    return response;
  }

  attendanceOverview(): Observable<any> {
    const token = this.cookieService.get('id_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const options = { headers: headers };
    const response = this.http.get<any>(`${this.BASE_URL}/classattendance/overview`, options);
    return response;
  }

  allStudnetsOverview(): Observable<any> {
    const token = this.cookieService.get('id_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const options = { headers: headers };
    const response = this.http.get<any>(`${this.BASE_URL}/classattendance/allstudents`, options);
    return response;
  }

  attendanceSummary(id:string): Observable<any> {
    const token = this.cookieService.get('id_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const params = new HttpParams().set('id',id );
    const options = { headers: headers,params:params };
    const response = this.http.get<any>(`${this.BASE_URL}/classattendance/summary`, options);
    return response;
  }

  updateStudentAttendance(access_code:string,username:string){
    const token = this.cookieService.get('id_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const options = { headers: headers };
    const data = {access_code:access_code,username:username}
    const response = this.http.post<any>(`${this.BASE_URL}/updateattendance`,data,options);
    return response;
  }

  deleteStudentAttendance(id:string){
    const token = this.cookieService.get('id_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const params = new HttpParams().set('id',id );
    const options = { headers: headers,params:params };
    const response = this.http.delete<any>(`${this.BASE_URL}/updateattendance`,options);
    return response;
  }

  studentAttendanceDetails(id:string){
    const token = this.cookieService.get('id_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const params = new HttpParams().set('id',id );
    const options = { headers: headers,params:params };
    const response = this.http.get<any>(`${this.BASE_URL}/userdetails`,options);
    return response;
  }

}
