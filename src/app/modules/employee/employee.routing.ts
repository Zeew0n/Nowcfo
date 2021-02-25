import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../services/_guards/auth-guard';
import { EmployeeComponent } from './components/employee.component';
const routes: Routes = [
    {
      path: '',
      children: [
        {path: '', component:EmployeeComponent}
      ]
    }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeeRoutingModule { }