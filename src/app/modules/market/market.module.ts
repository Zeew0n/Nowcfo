import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { MarketRoutingModule } from './market-routing.module';
import { MarketAllocationComponent } from './components/market-allocation/market-allocation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { CreateMarketAllocationComponent } from './components/create-market-allocation/create-market-allocation.component';


@NgModule({
  declarations: [MarketAllocationComponent, CreateMarketAllocationComponent],
  imports: [
    CommonModule,
    MarketRoutingModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule
    
  ]
})
export class MarketModule { }
