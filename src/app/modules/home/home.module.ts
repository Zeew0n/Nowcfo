import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HomePageComponent } from './components/home-page/home-page.component';
import { HomeRoutingModule } from './home-routing.module';


@NgModule({
    declarations: [
        HomePageComponent
    ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule,
    ],
    providers: []
})
export class HomeModule { }
