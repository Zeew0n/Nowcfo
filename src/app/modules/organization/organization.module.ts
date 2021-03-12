import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserModule } from '@angular/platform-browser';
import { OrganizationRoutingModule } from './organization.routing';
import { OrganizationComponent } from './components/organization/organization.component';
import { OrgEmployeesComponent } from './components/org-employees/org-employees.component';

@NgModule({
  imports: [
    CommonModule,
    OrganizationRoutingModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    ToastrModule,
  ],
  declarations: [OrganizationComponent, OrgEmployeesComponent],
  providers: [],
})
export class OrganizationModule {}
