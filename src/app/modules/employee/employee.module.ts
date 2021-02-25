import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserModule } from '@angular/platform-browser';
import { EmployeeRoutingModule } from './employee.routing';

@NgModule({
    imports: [
        CommonModule,
        
        EmployeeRoutingModule,
        FormsModule,
        NgSelectModule,
        ReactiveFormsModule,
        ToastrModule,
    ],
    declarations: [ ],
    providers: []
})
export class EmployeeModule { }
