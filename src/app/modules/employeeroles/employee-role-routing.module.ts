import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../services/_guards/auth-guard';
import { EmployeeRoleComponent } from './components/employeerole.component';
const routes: Routes = [
    {
      path: '',
      children: [
        {path: '', component:EmployeeRoleComponent}
      ]
    }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeeRoleRoutingModule { }