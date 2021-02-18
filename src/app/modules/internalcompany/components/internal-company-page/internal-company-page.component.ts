import { Component, Output, EventEmitter, } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { InternalCompanyModel } from '../../../../models/internal-company.model';
import { InternalCompanyService } from '../../services/internal-company.service';
import { NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-internal-company-page',
    templateUrl: './internal-company-page.component.html',
})

export class InternalCompanyPageComponent {
}

//     /* Inputs */

//     /* Outputs */

//     /* Form Declarations */
//     internalCompanyForm: FormGroup;
//     name = new FormControl('', [Validators.required]);
//     isActive = new FormControl('true', [Validators.required]);
//     lastUpdate = new FormControl('', [Validators.required]);
//     createDate = new FormControl('', [Validators.required]);
//     selectedSimpleItem = 'Two';
//     simpleItems = [];
//     /* Model Declarations*/
//     companies: InternalCompanyModel[];
//     sc: InternalCompanyModel = new InternalCompanyModel();

//     /* Other Declarations */    
//     isSubmitting: boolean; //Form submission variable
//     closeResult = ''; //close result for modal




//     constructor(
//     private fb: FormBuilder,
//     private internalCompanyService: InternalCompanyService,
//     private modalService: NgbModal,
//     private toastr: ToastrService){

//     }

//     ngOnInit() {
//         this.initializeInternalCompanyForm(); //initialize
//         this.simpleItems = ['One', 'Two', 'Three'];
//     }

//     onSubmit(form: FormGroup) {
//         this.sc.name = form.value.name;
//         this.sc.isActive = form.value.isActive;
//         this.sc.updatedDate = form.value.lastUpdate;
//         this.sc.createdDate = form.value.createDate;

//         this.internalCompanyService.POSTED(this.sc).subscribe(
//             (res) => {
//                 this.isSubmitting = false;
//                 this.toastr.success('Internal Company Added Successfully.', 'Success!');
//                 this.modalService.dismissAll();
//             },
//             error => {
//                 console.log(error);
//                 this.isSubmitting = false;
//                 this.modalService.dismissAll();
//                 this.toastr.error(error.error.errorMessage, 'Error!');
//             });
//     }

//     /*
//      * Initialize Engagement Form
//      */
//     initializeInternalCompanyForm() {
//         this.internalCompanyForm = new FormGroup({
//             name : this.name,
//             isActive : this.isActive,
//             lastUpdate : this.lastUpdate,
//             createDate : this.createDate
//         });
//     }

//     /*
//      * Modal Open and Dismiss
//      */ 
//     open(content) {
//         this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
//             this.closeResult = `Closed with: ${result}`;
//         }, (reason) => {
//             this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
//         });
//     }

//     private getDismissReason(reason: any): string {
//         if (reason === ModalDismissReasons.ESC) {
//             return 'by pressing ESC';
//         } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
//             return 'by clicking on a backdrop';
//         } else {
//             return `with: ${reason}`;
//         }
//     }
// }
