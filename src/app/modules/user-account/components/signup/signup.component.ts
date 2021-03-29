import { Component, Output, EventEmitter, } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AdminRegistrationService } from '../../services/admin-signup.service';
import { AdminSignUpModel } from '../../../../models/user/admin-signup.model';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
})

export class SignupComponent {
    /* Inputs */

    /* Outputs */

    /* Form Declarations */
    adminRegistrationForm: FormGroup;
    userName = new FormControl('', [Validators.required]);
    password = new FormControl('', [Validators.required]);
    confirmPassword = new FormControl('', [Validators.required]);


    /* Other Declarations */
    isSubmitting: boolean; //Form submission variable
    closeResult = ''; //close result for modal



    constructor(
        private fb: FormBuilder,
        private adminRegistrationService: AdminRegistrationService,
        private modalService: NgbModal,
        private toastr: ToastrService) {
    }

    ngOnInit() {
        this.initializeAdminRegistrationForm(); //initialize
    }

    /*
     * Initialize Engagement Form
     */
    initializeAdminRegistrationForm() {
        this.adminRegistrationForm = new FormGroup({
            userName: this.userName,
            password: this.password,
            confirmPassword: this.confirmPassword
        });
    }
    
    //onSubmit(form: FormGroup) {
    //}

    onSubmit() {
        const createForm = this.adminRegistrationForm.value;
          if (this.adminRegistrationForm.valid) {
            const model = new AdminSignUpModel();
            model.userName = createForm.userName;
            model.password = createForm.password;
            model.confirmPassword = createForm.confirmPassword;
            this.adminRegistrationService.signUpAdmin(model).subscribe(
              (res) => {
                this.toastr.success('Super Admin Created Successfully.', 'Success!');
                this.modalService.dismissAll();
              },
              error => {
                console.log(5);
                this.toastr.error(error.error.errorMessage !== undefined ?
                  error.error.errorMessage : 'Super Admin Creation Failed!', 'Error!');
              });
    
          }
        
        }


    checkPasswords(form: FormGroup) {
        let pass = form.value.password;
        let confirmPass = form.value.confirmPassword;

        return pass === confirmPass ? null : { notSame: true }
    }


    /*
     * Modal Open and Dismiss
     */
    open(content) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
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
}
