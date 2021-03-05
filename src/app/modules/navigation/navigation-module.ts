import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NavigationRoutingModule } from './navigation-routing.module';
import { TreeviewModule } from 'ngx-treeview';
@NgModule({
  imports: [
    CommonModule,
    NavigationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule,
    TreeviewModule.forRoot(),
  ],
  declarations: [],
  providers: [],
})
export class NavigationModule {}
