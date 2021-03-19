import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { match_value } from '../../../../services/_validators/confirmation.validator';
import { ConfirmUserService } from '../../services/confirm-user.service';

@Component({
    selector: 'app-confirmsignup',
    templateUrl: './confirm-signup.component.html',
    styleUrls: ['./confirm-signup.component.scss'],
})

export class ConfirmSignupComponent implements OnInit {
    /* Inputs */

    /* Outputs */


    /* Model Declarations*/

    /* Other Declarations */
    isSubmitting: boolean; //Form submission variable
    closeResult = ''; //close result for modal
    loginCheck: boolean;
    userId: string = '';
    token: string ='';
    isTokenValid: boolean = false; //Form submission variable

    constructor(public fb: FormBuilder,
        private ConfirmUserService: ConfirmUserService,
        private router: Router,
        private toastr: ToastrService,
        private route: ActivatedRoute,) {
    }

    ngOnInit() {
        this.getValue();
    }

    getValue() {
        this.route.params.subscribe((params) => {
            this.userId = params.uid;
            this.token=params.token;
            console.log(params);
            this.ConfirmUserService.confirmUser(this.userId, this.token)
                .subscribe(() => {
                    this.isTokenValid = true;
                    this.router.navigateByUrl('login');
                }, error => {
                    this.isTokenValid = false;
                });
        });

        
    }

}
