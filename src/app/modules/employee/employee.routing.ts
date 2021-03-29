import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/services/_guards/auth-guard';
import { EmployeeComponent } from './components/employee-info/employee.component';
import { EmployeeRoleComponent } from './components/employee-role/employeerole.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {path: '', component:EmployeeComponent, canActivate: [AuthGuard]},
      {
        path: 'employee-information',
        component: EmployeeComponent,
        canActivate: [AuthGuard]
      },
  
      {
        path: 'employee-role',
        component: EmployeeRoleComponent,
        canActivate: [AuthGuard]
      },
    ]
  }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeeRoutingModule { }