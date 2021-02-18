import { Injectable } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeletePopupComponent } from '../components/delete-popup/delete-popup.component';

@Injectable({
  providedIn: 'root'
})
export class SharedModalService {
  private deleteModalRef: NgbModalRef;
  private confirmModalRef: NgbModalRef;

  constructor(private modalService: NgbModal) { }
  public confirmDelete(title: string): Promise<boolean> {
    this.deleteModalRef = this.modalService.open(DeletePopupComponent, { windowClass: 'modal-gosend modal-delete' });
    this.deleteModalRef.componentInstance.title = `Confirm delete ${title}`;
    this.deleteModalRef.componentInstance.message = `Are you sure you want to delete the selected ${title}`;
    return this.deleteModalRef.result;
  }

  // public completeProject(title: string, message: string): Promise<boolean> {
  //   this.confirmModalRef = this.modalService.open(CompleteProjectComponent,
  //     {
  //       backdrop: 'static', windowClass: 'modal-holder'
  //     });
  //   this.confirmModalRef.componentInstance.title = title;
  //   this.confirmModalRef.componentInstance.message = message;
  //   return this.confirmModalRef.result;
  // }
}
