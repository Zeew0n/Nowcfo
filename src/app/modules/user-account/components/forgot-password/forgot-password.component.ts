import { Component, OnInit } from '@angular/core';
//import { NgForm, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminSignUpModel } from 'src/app/models/user/admin-signup.model';
import { ForgetPasswordService } from '../../services/forget-password.service';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
@Component({
    selector: 'app-forgotpassword',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
    /* Inputs */

    /* Outputs */

    /* Form Declarations */
    RequestPasswordForm: FormGroup;
    email = new FormControl(null, [Validators.required]);

    /* Model Declarations*/

    /* Other Declarations */
    isSubmitting: boolean; //Form submission variable
    closeResult = ''; //close result for modal
    loginCheck: boolean;


    constructor(
        private forgotPasswordService: ForgetPasswordService,
        private router: Router,
        private modalService: NgbModal,
        private toastr: ToastrService) {
    }

    ngOnInit() {
        this.initializeLoginForm();
    }
  
    /*
     * Initialize Login Form
     */
    initializeLoginForm(){
        this.RequestPasswordForm = new FormGroup({
            email: this.email
        });
    }

    onSubmit() {
        const createForm = this.RequestPasswordForm.value;
        debugger;
        console.log("Hello");
          if (this.RequestPasswordForm.valid) {
            const model = new AdminSignUpModel();
            debugger;
            model.userName = createForm.email;
            this.forgotPasswordService.forgetPassword(model).subscribe(
              (res) => {
                this.toastr.success('Password Reset Email Sent Successfully!', 'Success!');
                this.modalService.dismissAll();
              },
              error => {
                console.log(5);
                this.toastr.error(error.error.errorMessage !== undefined ?
                  error.error.errorMessage : 'User Email Not Found!', 'Error!');
              });
    
          }
        
        }

 
}
