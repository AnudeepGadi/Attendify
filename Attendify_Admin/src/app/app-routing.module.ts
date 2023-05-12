import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccessCodeComponent } from './access-code/access-code.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent} from './login/login.component';
import { ClassReportsComponent } from './class-reports/class-reports.component';
import { StudentReportsComponent } from './student-reports/student-reports.component';
import { SummaryComponent } from './summary/summary.component';
import { StudentsOverviewComponent } from './students-overview/students-overview.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {path:'',component:LandingPageComponent},
  {path:'login',component:LoginComponent},
  {path:'AccessCode',component:AccessCodeComponent, canActivate:[AuthGuard]},
  {path:'ClassReports',component:ClassReportsComponent, canActivate:[AuthGuard]},
  {path:'ClassReports/:id',component:SummaryComponent, canActivate:[AuthGuard]},
  {path:'StudentReports',component:StudentsOverviewComponent, canActivate:[AuthGuard]},
  {path:'StudentReports/:id',component:StudentReportsComponent, canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
