import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../services/_guards/auth-guard';
import { UsersManagement } from './components/users-management/users-management.component';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
  
    {
      path: '',
      children: [
       {path: '/users', component: UsersManagement}
      ]
    }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersManagementRoutingModule { }
