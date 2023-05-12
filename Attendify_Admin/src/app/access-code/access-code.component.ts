import { Component } from '@angular/core';
import { AdminService } from '../admin.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-access-code',
  templateUrl: './access-code.component.html',
  styleUrls: ['./access-code.component.css'],
})
export class AccessCodeComponent {
  otp = '';
  accessCodeID = '';
  isOn = true;
  AccessCodeGenerated = false;
  subscription = new Subscription();

  constructor(private adminService: AdminService) {}

  async generateAccessCode() {
    this.adminService
      .generateAccessCode()
      .pipe(
        catchError((error) => {
          let error_message: string;
          if (error.status === 403) {
            error_message = `Admin access required`;
          } else {
            error_message = `An error occurred. Please try again later.`;
          }
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: error_message,
            showConfirmButton: false,
            timer: 1500,
          });
          return throwError(() => new Error(error_message));
        })
      )
      .subscribe((resp) => {
        this.otp = resp.access_code;
        this.accessCodeID = resp.access_code_id;
        this.AccessCodeGenerated = true;
        this.isOn = true;
      });
  }


  onAccessCodeSwitchChange() {
    let access_code_switch = this.isOn ? 'ON' : 'OFF';
    this.adminService
      .changeAccessCodeStatus(this.accessCodeID, access_code_switch)
      .pipe(
        catchError((error) => {
          let error_message: string;
          console.log("I am catching ",error);
          if (error.status === 403) {
            error_message = `Admin access required`;
          } else if(error.status === 400){
            error_message = `Wrong Option Selected`;
          }else {
            error_message = `An error occurred. Please try again later.`;
          }
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: error_message,
            showConfirmButton: false,
            timer: 1500,
          });
          this.isOn = this.isOn ? false : true ;
          return throwError(() => new Error(error_message));
        })
      )
      .subscribe((data) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Access Code turned ${this.isOn?'On':'Off'}`,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  }

  ngOnInit() {
    this.adminService.sendNotification("");
  }

}
