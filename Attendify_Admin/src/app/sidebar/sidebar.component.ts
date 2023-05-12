import { Component,Input } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

interface MenuItem {
  id: number;
  name: string;
  iconClass: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  username:string = "";
  
  constructor(private adminService:AdminService,private cookieService:CookieService, private router: Router) {
    this.adminService.getNotification().subscribe(() => {
      this.getAdminInitialData();
    });
  }
  
  async getAdminInitialData() {
    this.adminService.getAdminInitialData().pipe(
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
          timer: 2000,
        }).then(()=>this.logout());
        return throwError(() => new Error(error_message));
      })
    ).subscribe((resp) => {
      this.username = resp.name;
    });
  }

  logout(){
      this.cookieService.delete('id_token');
      this.username="";
      this.router.navigate(['']);
  }
 
}
