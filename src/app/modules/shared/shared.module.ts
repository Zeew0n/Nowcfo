import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CompanyCardComponent } from './components/company-card/company-card.component';
import { AddContactComponent } from './components/add-contact/add-contact.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { DeletePopupComponent } from './components/delete-popup/delete-popup.component';

@NgModule({
  declarations: [CompanyCardComponent, AddContactComponent, PaginationComponent, DeletePopupComponent],
  imports: [CommonModule, RouterModule],
  exports: [CompanyCardComponent, AddContactComponent, PaginationComponent, DeletePopupComponent],
})
export class SharedModule { }
