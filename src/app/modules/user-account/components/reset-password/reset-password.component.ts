import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserSignUpModel } from '../../../../models/user/user-signup.model';
import { match_value } from '../../../../shared/_validators/confirmation.validator';
import { ForgetPasswordService } from '../../services/forget-password.service';
//import { UserRegistrationService } from '../../services/user-registration.service';

@Component({
    selector: 'app-resetpassword',
    templateUrl: './reset-password.component.html'
})

//This is comment

export class ResetPasswordComponent implements OnInit {
    /* Inputs */

    /* Outputs */

    /* Form Declarations */
    UpdatePasswordForm: FormGroup;
    userName = new FormControl(null, [Validators.required]);
    password = new FormControl(null, [Validators.required]);
    confirmPassword = new FormControl(null, [Validators.required, match_value('password')]);

    /* Model Declarations*/

    /* Other Declarations */
    isSubmitting: boolean; //Form submission variable
    closeResult = ''; //close result for modal
    loginCheck: boolean;
    userId: string = '';
    token: string = '';
    isDisabled = true;

    isTokenValid: boolean = false; //Form submission variable

    constructor(public fb: FormBuilder,
        private forgetPasswordService: ForgetPasswordService,
        private router: Router,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private ngxLoaderService: NgxUiLoaderService,
    ) {

    }

    ngOnInit() {
        this.ngxLoaderService.start();
        this.initializeSignUpForm();
        this.getValue();
        // this.ngxLoaderService.stop();

    }

    getValue() {

        this.route.params.subscribe((params) => {
            this.userId = params.uid;
            this.token = params.token;
            debugger
            this.UpdatePasswordForm.patchValue({
                userName: params.uname,
            });
            this.forgetPasswordService.verifyToken(params.uid, params.token)
                .subscribe(() => {
                    this.isTokenValid = true;
                    this.ngxLoaderService.stop();
                }, error => {
                    this.isTokenValid = false;
                    this.ngxLoaderService.stop();
                });
        });


    }

    /*
     * Initialize Login Form
     */
    initializeSignUpForm() {
        this.UpdatePasswordForm = this.fb.group({
            userName: this.userName,
            password: this.password,
            confirmPassword: this.confirmPassword,


        });
    }



    onSubmit() {
        const userSignUpForm = this.UpdatePasswordForm.value;
        if (this.UpdatePasswordForm.valid) {
            const model = new UserSignUpModel();
            model.id = this.userId;
            model.userName = userSignUpForm.userName;
            model.password = userSignUpForm.password;
            model.confirmPassword = userSignUpForm.confirmPassword;
            model.token = this.token;

            this.forgetPasswordService.updatePassword(model).subscribe(
                () => {
                    this.toastr.success('Password Reset Successfully.', 'Success!');
                    this.router.navigate(['']);
                },
                error => {
                    this.toastr.error(error.error.errorMessage !== undefined ?
                        error.error.errorMessage : 'Password Reset failed', 'Error!');
                });
        }
    }

}
