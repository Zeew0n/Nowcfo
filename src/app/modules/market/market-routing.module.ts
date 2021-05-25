import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/_guards/auth-guard';
import { CreateMarketAllocationComponent } from './components/create-market-allocation/create-market-allocation.component';
import { MarketAllocationComponent } from './components/market-allocation/market-allocation.component';
import { ViewMarketAllocationComponent } from './components/view-market-allocation/view-market-allocation.component';


const routes: Routes = [
 {
  path: '',
  children: [
    {path: '', component: MarketAllocationComponent, canActivate: [AuthGuard]},
    {
      path: 'market-allocation',
      component: MarketAllocationComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'market-allocation',
      component: MarketAllocationComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'create-market-allocation',
      component: CreateMarketAllocationComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'view-market-allocation',
      component: ViewMarketAllocationComponent,
      canActivate: [AuthGuard],
    }
  ]
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketRoutingModule { }
