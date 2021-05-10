import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/_guards/auth-guard';
import { EmployeeListsResolver } from 'src/app/shared/_resolver/employeeList';
import { EmployeeComponent } from './components/employee-info/employee.component';
import { EmployeePermissionComponent } from './components/employee-permission/employee-permission.component';
import { EmployeeRoleComponent } from './components/employee-role/employeerole.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {path: '', component:EmployeeComponent, canActivate: [AuthGuard]},
      {
        path: 'employee-information',
        component: EmployeeComponent,
        canActivate: [AuthGuard],
        resolve: { employees: EmployeeListsResolver }
      },
  
      {
        path: 'employee-role',
        component: EmployeeRoleComponent,
        canActivate: [AuthGuard]
      },

      {
        path: 'employee-permission',
        component: EmployeePermissionComponent,
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