import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SalesForecastComponent } from './components/sales-forecast.component';
import { SalesForecastRoutingModule } from './sales-forecast.routing';
import { ForecastListsResolver } from 'src/app/shared/_resolver/forecastList';

@NgModule({
    imports: [
        CommonModule,
        SalesForecastRoutingModule,
        FormsModule,
        NgSelectModule,
        ReactiveFormsModule,
        ToastrModule,
        NgbModule,
        PaginationModule.forRoot(),
        NgxPaginationModule,
        BsDatepickerModule.forRoot()
        
    ],
    declarations: [SalesForecastComponent],
    providers: [ForecastListsResolver]
})
export class SalesForecastModule { }
