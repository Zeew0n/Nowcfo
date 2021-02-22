import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { create } from 'domain';
import { RoleModel } from 'src/app/models/role.model';
@Component({
    selector: 'app-userinformation-list',
    templateUrl: './userinformation.component.html',
})

export class UserInformationComponent {

    roles: RoleModel[];

    isSubmitting: boolean; // Form submission variable
    closeResult = ''; // close result for modal
    submitted = false;
    userId: string = '';
    isEdit: boolean = false;
    selectedSimpleItem = 'User';
    websiteList: any = ['User', 'Admin']
    simpleItems = [];
    isUpdate = false;
    selectCompany;
    constructor(
        private modalService: NgbModal) { }
    open(content) {
        this.isUpdate = false;
        this.isEdit = false;
        this.userId = '';
        this.openModal(content);
    }

    onSubmit() {
        debugger;
    }
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    private openModal(content: any) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-cfo' }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

}
