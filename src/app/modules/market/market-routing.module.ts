import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/_guards/auth-guard';
import { MarketAllocationComponent } from './components/market-allocation/market-allocation.component';


const routes: Routes = [
 {
  path: '',
  children: [
    {path: '', component: MarketAllocationComponent, canActivate: [AuthGuard]},
    {
      path: 'market-allocation',
      component: MarketAllocationComponent,
      canActivate: [AuthGuard],
    }]
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketRoutingModule { }
