import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
//import { UsersManagementComponent } from './components/users-management/users-management.component';
import { UsersManagementRoutingModule } from './users-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [
        //UsersManagementComponent
    ],
    imports: [
        CommonModule,
        UsersManagementRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule,
        NgSelectModule
    ],
    providers: []
})
export class UsersModule { }
