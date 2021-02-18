import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../services/_guards/auth-guard';
import { UserProfile } from './components/user-profile/user-profile.component';

const routes: Routes = [
    {
      path: '',
      children: [
        {path: '', component: UserProfile}
      ]
    }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule { }