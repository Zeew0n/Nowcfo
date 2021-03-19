import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserModule } from '@angular/platform-browser';
import { MenuRoutingModule } from './menu-routing.module';

@NgModule({
    imports: [
        CommonModule,
        MenuRoutingModule,
        FormsModule,
        NgSelectModule,
        ReactiveFormsModule,
        ToastrModule,
    ],
    declarations: [ ],
    providers: []
})
export class MenuModule { }
