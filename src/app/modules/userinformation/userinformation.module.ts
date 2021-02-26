import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { UserInformationRoutingModule } from './userinformation.routing';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    imports: [
        CommonModule,
        UserInformationRoutingModule,
        FormsModule,
        NgSelectModule,
        ReactiveFormsModule,
        ToastrModule,
    ],
    declarations: [ ],
    providers: []
})
export class UserInformationModule { }
