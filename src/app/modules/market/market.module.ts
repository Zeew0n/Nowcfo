import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { MarketRoutingModule } from './market-routing.module';
import { MarketAllocationComponent } from './components/market-allocation/market-allocation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxPaginationModule } from 'ngx-pagination';
import { AllocationListsResolver } from 'src/app/shared/_resolver/allocationList';
import { CreateMarketAllocationComponent } from './components/create-market-allocation/create-market-allocation.component';


@NgModule({
 
  imports: [
    CommonModule,
    MarketRoutingModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule,
    PaginationModule.forRoot(),
    NgxPaginationModule,
    
  ],
  declarations: [MarketAllocationComponent, CreateMarketAllocationComponent],
  providers: [AllocationListsResolver]
})
export class MarketModule { }
