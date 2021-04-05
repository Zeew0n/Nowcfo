import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { EmployeeRoutingModule } from './employee.routing';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ChildComponent } from './components/child/child.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { TreeviewModule } from 'ngx-treeview';
import { EmployeeComponent } from './components/employee-info/employee.component';
import { EmployeeRoleComponent } from './components/employee-role/employeerole.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { EmployeeListsResolver } from 'src/app/_resolver/employeeList';
import { PaginationModule } from 'ngx-bootstrap/pagination';



@NgModule({
    imports: [
        CommonModule,
        TreeviewModule.forRoot(),
        EmployeeRoutingModule,
        FormsModule,
        NgSelectModule,
        ReactiveFormsModule,
        ToastrModule,
        NgMultiSelectDropDownModule,
        PaginationModule.forRoot(),
        NgxPaginationModule
        
    ],
    declarations: [EmployeeComponent,ChildComponent,EmployeeRoleComponent],
    providers: [EmployeeListsResolver]
})
export class EmployeeModule { }
