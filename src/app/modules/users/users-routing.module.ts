import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../services/_guards/auth-guard';
//import { UsersManagementComponent } from './components/users-management/users-management.component';

const routes: Routes = [
    {
      path: '',
      children: [
       // {path: '', component: UsersManagementComponent}
      ]
    }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersManagementRoutingModule { }