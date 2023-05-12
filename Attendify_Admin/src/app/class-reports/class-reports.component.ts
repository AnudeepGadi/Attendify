import { Component } from '@angular/core';
import { AdminService } from '../admin.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-class-reports',
  templateUrl: './class-reports.component.html',
  styleUrls: ['./class-reports.component.css']
})
export class ClassReportsComponent {
  attendanceData : Array<any> = [];
  number_of_students = 0;

  constructor(private adminService:AdminService){}
  p: number = 1;

  
  onDownload(id:Number){
    let table_id="";
    if(id === -1)
    table_id = 'overview-table';
    const table = document.getElementById(table_id);
    this.attendanceData = this.attendanceData.map(data=>({...data, AttendancePercentage: (data.present/this.number_of_students)*100}));
    const worksheet = XLSX.utils.json_to_sheet(this.attendanceData);
    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
    // Convert the workbook to an Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    // Save the Excel file
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, 'AttendanceOverviewReport.xlsx');
  }

  async getAttendanceOverview() {
    this.adminService
      .attendanceOverview()
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
        this.number_of_students = data.number_of_students;
      });
  }

  onAccessCodeSwitchChange(id:string, isOn:boolean,rno:number) {
    console.log(id,isOn,rno);
    let access_code_switch = isOn ? 'ON' : 'OFF';
    this.adminService
      .changeAccessCodeStatus(id, access_code_switch)
      .pipe(
        catchError((error) => {
          let error_message: string;
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
          this.attendanceData[rno-1].Accepting = isOn ? false : true ;
          return throwError(() => new Error(error_message));
        })
      )
      .subscribe((data) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Access Code turned ${isOn?'On':'Off'}`,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  }


  ngOnInit(){
    this.getAttendanceOverview();
  }

}
