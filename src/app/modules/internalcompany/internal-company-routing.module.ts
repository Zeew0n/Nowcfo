import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../services/_guards/auth-guard';
import { InternalCompanyPageComponent } from './components/internal-company-page/internal-company-page.component';
import {InternalCompanyListComponent} from './components/internal-company-list/internal-company-list.component';
const routes: Routes = [
    {
      path: '',
      children: [
        {path: '', component: InternalCompanyListComponent, canActivate: [AuthGuard]}
      ]
    }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InternalCompanyRoutingModule { }
export const internalComList = [InternalCompanyListComponent, InternalCompanyPageComponent]