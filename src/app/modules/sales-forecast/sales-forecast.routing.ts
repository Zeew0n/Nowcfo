import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/_guards/auth-guard';
import { ForecastListsResolver } from 'src/app/shared/_resolver/forecastList';
import { SalesForecastComponent } from './components/sales-forecast.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {path: '', component:SalesForecastComponent, canActivate: [AuthGuard]},
      {
        path: 'sales-forecast',
        component: SalesForecastComponent,
        canActivate: [AuthGuard],
        resolve: { forecasts: ForecastListsResolver }

      },
    ]
}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesForecastRoutingModule {}
