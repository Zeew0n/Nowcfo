import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../services/_guards/auth-guard';
import { UserInformationComponent } from './components/userinformation.component';
const routes: Routes = [
    {
      path: '',
      children: [
        {path: '', component:UserInformationComponent}
      ]
    }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserInformationRoutingModule { }
//export const internalComList = [InternalCompanyListComponent, InternalCompanyPageComponent]