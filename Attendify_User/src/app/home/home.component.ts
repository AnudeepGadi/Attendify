import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  otpDigits: string[] = ['', '', '', '', '', '', '', ''];
  username: string = '';
  p: number = 1;

  attendanceList: Array<any> = [];

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private userService: UserService
  ) {}

  async setInitialData() {
    await this.userService.getUserInitialData().subscribe((resp) => {
      this.attendanceList = resp.attendanceList;
      this.username = resp.name;
    });
  }

  ngOnInit() {
    this.setInitialData();
    // var result = {
    //   attendanceList: [
    //     {
    //       rno: '1',
    //       attendance_taken_on: '2023-04-19T22:05:39.294Z',
    //       marked_at: '2023-04-21T04:52:14.423Z',
    //     },
    //     {
    //       rno: '2',
    //       attendance_taken_on: '2023-04-19T20:06:45.960Z',
    //       marked_at: null,
    //     },
    //     {
    //       rno: '3',
    //       attendance_taken_on: '2023-04-19T19:59:27.763Z',
    //       marked_at: null,
    //     },
    //     {
    //       rno: '4',
    //       attendance_taken_on: '2023-04-19T19:58:13.774Z',
    //       marked_at: null,
    //     },
    //     {
    //       rno: '5',
    //       attendance_taken_on: '2023-04-19T18:23:02.259Z',
    //       marked_at: null,
    //     },
    //   ],
    //   name: 'Anudeep Gadi',
    // };
    // this.attendanceList = result.attendanceList;
    // this.username = result.name;
  }

  onKeyUp(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (event.key === 'Backspace') {
      if (value === '') {
        const previousInput = input.previousElementSibling as HTMLInputElement;
        previousInput.focus();
        previousInput.value = '';
      }
      this.otpDigits[index] = '';
    } else {
      if (value.length > 1) {
        input.value = value.slice(0, 1);
        this.otpDigits[index] = value.slice(0, 1);
      } else {
        this.otpDigits[index] = value;
      }
      if (index < this.otpDigits.length - 1 && value !== '') {
        const nextInput = input.nextElementSibling as HTMLInputElement;
        nextInput.focus();
      }
    }
  }

  onSubmit() {
    const otp = this.otpDigits.join('');
    this.userService
      .markAttendance(otp)
      .pipe(
        catchError((error) => {
          Swal.fire({
            position:'center',
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            showConfirmButton: false,
            timer: 1500,
          });
          return throwError(() => new Error('An error occurred. Please try again later.'));
        })
      )
      .subscribe((response) => {
        if (response.code !== -1)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: response.message,
          showConfirmButton: false,
          timer: 1500,
        });
        else
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: response.message,
          showConfirmButton: false,
          timer: 1500,
        });
        
        this.setInitialData();
      });
  }

  onLogOut() {
    this.cookieService.delete('id_token');
    this.router.navigate(['']);
  }

  onDownload() {
    const table = document.getElementById('attendance-report');
    const worksheet = XLSX.utils.table_to_sheet(table);

    const columnWidths = [
      {wch: 10},
      {wch: 20},
      {wch: 20}
    ];

    worksheet['!cols'] = columnWidths;

  
    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
    // Convert the workbook to an Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    // Save the Excel file
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, 'AttendanceReport.xlsx');
  }
  
}
