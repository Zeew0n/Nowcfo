import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserModule } from '@angular/platform-browser';
import { EmployeeRoutingModule } from './employee.routing';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ChildComponent } from './components/child/child.component';
import { EmployeeComponent } from './components/employee.component';

import { TreeviewModule } from 'ngx-treeview';
import { KendotreeviewComponent } from './components/kendotreeview/kendotreeview.component';
import { TreeViewModule } from '@progress/kendo-angular-treeview';

@NgModule({
    imports: [
        CommonModule,
        TreeviewModule.forRoot(),
        EmployeeRoutingModule,
        //TreeViewModule,
        FormsModule,
        NgSelectModule,
        ReactiveFormsModule,
        ToastrModule,
        NgMultiSelectDropDownModule,
        
    ],
    declarations: [EmployeeComponent,ChildComponent],
    providers: []
})
export class EmployeeModule { }
