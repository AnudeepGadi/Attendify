import { Component } from '@angular/core';
import { AdminService } from '../admin.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-students-overview',
  templateUrl: './students-overview.component.html',
  styleUrls: ['./students-overview.component.css'],
})
export class StudentsOverviewComponent {
  attendanceData: Array<any> = [];
  number_of_classes = 0;

  constructor(private adminService: AdminService) {}
  p: number = 1;

  onDownload() {
    this.attendanceData = this.attendanceData.map((data) => ({
      ...data,
      AttendancePercentage: (data.Present / this.number_of_classes) * 100,
    }));
    const worksheet = XLSX.utils.json_to_sheet(this.attendanceData);
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
    FileSaver.saveAs(blob, 'AllStudentsReport.xlsx');
  }

  async getAttendanceOverview() {
    this.adminService
      .allStudnetsOverview()
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
        this.attendanceData = data.attendanceList;
        this.number_of_classes = data.number_of_classes;
      });
  }


  ngOnInit() {
    this.getAttendanceOverview();
  }
}
