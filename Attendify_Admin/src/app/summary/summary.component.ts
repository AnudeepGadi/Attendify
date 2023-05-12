import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../admin.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent {
  activeTab = 1;
  p = 1;
  usernameFilter = '';
  id: string = '';
  attendanceList: any = [];
  anamoliesList: any = [];

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService
  ) {}

  getSummary() {
    this.adminService
      .attendanceSummary(this.id)
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
        console.log(data)
        this.attendanceList = data.attendanceSummary;
        this.anamoliesList = data.anomolies;
      });
  }

  filterByUserName(username: string) {
    if (username.length === 0) return this.attendanceList;
    return this.attendanceList.filter((user: { username: string }) =>
      user.username.includes(username)
    );
  }

  onDownload() {
    let table_id = 'summary-table';
    const table = document.getElementById(table_id);
    const worksheet = XLSX.utils.json_to_sheet(this.attendanceList);
    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Convert the workbook to an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the Excel file
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    FileSaver.saveAs(blob, 'AttendanceSummaryReport.xlsx');
  }

  updateAttendance(username: string) {
    this.adminService
      .updateStudentAttendance(this.id, username)
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
        this.getSummary();
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
        this.getSummary();
      });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
    this.getSummary();
  }
}
