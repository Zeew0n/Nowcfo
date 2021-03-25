import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PasswordUpdateModel } from 'src/app/models/user/user-password.update.model';
import { UserInformationService } from 'src/app/modules/userinformation/services/userinformation.service';
import { match_value } from 'src/app/services/_validators/confirmation.validator';
import AuthenticationService from '../../services/authentication.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  /* Inputs */

  /* Outputs */

  /* Form Declarations */
  ChangePasswordForm: FormGroup;
  currentPassword = new FormControl(null, [Validators.required]);
  password = new FormControl(null, [Validators.required]);
  confirmPassword = new FormControl(null, [Validators.required, match_value('password')]);

  /* Model Declarations*/

  /* Other Declarations */
  isSubmitting: boolean; //Form submission variable
  closeResult = ''; //close result for modal


  constructor(public fb: FormBuilder,
      private userService: UserInformationService,
      private router: Router,
      private toastr: ToastrService,
      private route: ActivatedRoute,
      private authService: AuthenticationService,
      ) {

  }

  ngOnInit() {
      this.initializeChangePasswordForm();
  }



  /*
   * Initialize Login Form
   */
  initializeChangePasswordForm() {
      this.ChangePasswordForm = this.fb.group({
          currentPassword:this.currentPassword,
          password: this.password,
          confirmPassword: this.confirmPassword 
      });
  }
  


  onSubmit() {
      const ChangePasswordForm = this.ChangePasswordForm.value;
      if (this.ChangePasswordForm.valid) {
        debugger
          const model = new PasswordUpdateModel();
          model.userName= this.authService.getUserName();
          model.currentPassword = ChangePasswordForm.currentPassword;
          model.password = ChangePasswordForm.password;
          model.confirmPassword = ChangePasswordForm.confirmPassword;
              
          this.userService.changePassword(model).subscribe(
              () => {
                  this.toastr.success('Passwod Change Successfully.', 'Success!');
                  this.router.navigate(['/home']);
              },
              error => {
                  this.toastr.error(error.error.errorMessage !== undefined ?
                      error.error.errorMessage : 'Please confirm your current password is valid', 'Error!');
              });
      }
  }

}
