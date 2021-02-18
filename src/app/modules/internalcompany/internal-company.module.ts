import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InternalCompanyRoutingModule,internalComList } from './internal-company-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    imports: [
        CommonModule,
        InternalCompanyRoutingModule,
        FormsModule,
        NgSelectModule,
        ReactiveFormsModule,
        ToastrModule,
    ],
    declarations: [ internalComList],
    providers: []
})
export class InternalCompanyModule { }
