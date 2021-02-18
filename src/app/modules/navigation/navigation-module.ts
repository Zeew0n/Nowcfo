import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NavigationRoutingModule } from './navigation-routing.module';


@NgModule({
    imports: [
        CommonModule,
        NavigationRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule
    ],
    declarations: [],
    providers: []
})
export class NavigationModule { }
