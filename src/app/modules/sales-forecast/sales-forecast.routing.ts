import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/_guards/auth-guard';
import { EmployeeListsResolver } from 'src/app/shared/_resolver/employeeList';
import { SalesForecastComponent } from './components/sales-forecast.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {path: '', component:SalesForecastComponent, canActivate: [AuthGuard]},
      {
        path: 'sales-forecast',
        component: SalesForecastComponent,
        canActivate: [AuthGuard]
      },
    ]
}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesForecastRoutingModule {}
