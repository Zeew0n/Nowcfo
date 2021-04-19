import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/_guards/auth-guard';
import { AdminUserComponent } from './components/admin-user/admin-user.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { LoginComponent } from './components/login/login.component';
import { UserInformationComponent } from './components/user-information/userinformation.component';
import { UserRoleComponent } from './components/user-role/userrole.component';

const routes: Routes = [
    {
      path: '',
      children: [
        {path: '', component: LoginComponent},
        {
          path: 'user-information',
          component: UserInformationComponent,
          canActivate: [AuthGuard]
        },

        {
            path: 'changepassword',
            component: ChangePasswordComponent,
            canActivate: [AuthGuard],
          },
        {
          path: 'user-role',
          component: UserRoleComponent,
          canActivate: [AuthGuard]
        },
        {
          path: 'admin-user',
          component: AdminUserComponent,
          canActivate: [AuthGuard]
        },
      ]
    }
    ];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserAccountRoutingModule { }
