import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';

import { AdminService } from './admin.service';

import { SidebarComponent } from './sidebar/sidebar.component';
import { AccessCodeComponent } from './access-code/access-code.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { ClassReportsComponent } from './class-reports/class-reports.component';
import { StudentReportsComponent } from './student-reports/student-reports.component';
import { SummaryComponent } from './summary/summary.component';
import { StudentsOverviewComponent } from './students-overview/students-overview.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    AccessCodeComponent,
    LandingPageComponent,
    LoginComponent,
    ClassReportsComponent,
    StudentReportsComponent,
    SummaryComponent,
    StudentsOverviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxPaginationModule,
    HttpClientModule
  ],
  providers: [AdminService],
  bootstrap: [AppComponent]
})
export class AppModule { }
