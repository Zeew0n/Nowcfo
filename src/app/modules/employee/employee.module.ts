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
import { EmployeeListsResolver } from 'src/app/shared/_resolver/employeeList';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { MiniChildComponent } from './components/minichild/minichild.component';
import { EmployeePermissionComponent } from './components/employee-permission/employee-permission.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {FocusModule} from 'angular2-focus';



@NgModule({
    imports: [
        CommonModule,
        FocusModule.forRoot(),
        TreeViewModule,
        EmployeeRoutingModule,
        FormsModule,
        NgSelectModule,
        ReactiveFormsModule,
        ToastrModule,
        NgbModule,
        NgMultiSelectDropDownModule,
        PaginationModule.forRoot(),
        NgxPaginationModule,
        BsDatepickerModule.forRoot()

        
    ],
    declarations: [EmployeeComponent,ChildComponent,MiniChildComponent,EmployeeRoleComponent, EmployeePermissionComponent],
    providers: [EmployeeListsResolver]
})
export class EmployeeModule { }
