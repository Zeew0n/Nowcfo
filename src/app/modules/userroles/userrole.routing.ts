import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../services/_guards/auth-guard';
import { UserRoleComponent } from './components/userrole.component';
const routes: Routes = [
    {
      path: '',
      children: [
        {path: '', component:UserRoleComponent}
      ]
    }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoleRoutingModule { }