import { Component } from '@angular/core';
import { AdminService } from '../admin.service';
import { ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-student-reports',
  templateUrl: './student-reports.component.html',
  styleUrls: ['./student-reports.component.css']
})
export class StudentReportsComponent {
  p: number = 1;
  attendanceList: Array<any> = [];
  user:any;
  username = '';

  constructor(private route: ActivatedRoute,
    private adminService : AdminService){}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.username = params['id'];
      this.getUserAttendanceDetails(this.username);
    });
  }

  async getUserAttendanceDetails(username:string) {
    await this.adminService.studentAttendanceDetails(username).subscribe((resp) => {
      console.log(resp);
      this.attendanceList = resp.attendanceList;
      this.user=resp.details[0];
    });
  }

  updateAttendance(accesscode:string) {
    this.adminService
      .updateStudentAttendance(accesscode, this.username)
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
      .subscribe((data) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Attendance Marked',
          showConfirmButton: false,
          timer: 1500,
        });
        this.getUserAttendanceDetails(this.username);
      });
  }

  deleteAttendance(attendance_id:string){
    this.adminService
      .deleteStudentAttendance(attendance_id)
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
      .subscribe((data) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Attendance Deleted',
          showConfirmButton: false,
          timer: 1500,
        });
        this.getUserAttendanceDetails(this.username);
      });
  }

  onDownload() {
    let d_attendanceList = this.attendanceList.map(({id,accesscode,...rest})=>rest);
    const worksheet = XLSX.utils.json_to_sheet(d_attendanceList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    FileSaver.saveAs(blob, `${this.username}_AttendanceReport.xlsx`);
  }

}
