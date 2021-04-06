import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserAuthResponseModel } from '../../../../models/user/user-auth-response.model';
import { Console } from 'console';
import jwt_decode from 'jwt-decode';
import AuthenticationService from '../../services/authentication.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  /* Inputs */

  /* Outputs */

  /* Form Declarations */
  loginForm: FormGroup;
  userName = new FormControl(null, [Validators.required]);
  password = new FormControl(null, [Validators.required]);

  /* Model Declarations*/

  /* Other Declarations */
  isSubmitting: boolean; // Form submission variable
  closeResult = ''; // close result for modal
  loginCheck: boolean;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
  ) {}

  ngOnInit() {
    this.initializeLoginForm();
  }

  /*
   * Initialize Login Form
   */
  initializeLoginForm() {
    this.loginForm = new FormGroup({
      userName: this.userName,
      password: this.password,
    });
  }

  onSubmit() {
    // this.isSubmitting = true;
    this.ngxService.start();
    if (this.loginForm.valid) {
      this.authenticationService.login(this.loginForm.value).subscribe(
        (res: UserAuthResponseModel) => {
          // this.isSubmitting = false;
          localStorage.clear();
          localStorage.setItem('auth_token', res.jwtToken);
          const token = jwt_decode(res.jwtToken) as any;
          localStorage.setItem('sidemenu', token.menus);
          localStorage.setItem('role_name', res.roleName);
          localStorage.setItem('refresh_token', res.refreshToken);
          localStorage.setItem('user_name', res.userName);
          this.toastr.success('Login Successful.', 'Success!');
          console.log(res);
          this.router.navigateByUrl('home');
          this.ngxService.stop();
        },
        (error) => {
          // this.isSubmitting = false;
          this.ngxService.stop();
          this.displayLoginErrorMessage(error);
        }
      );
    }
  }

  private displayLoginErrorMessage(error: any) {
    if (error.status === 401) {
      this.toastr.error('Invalid Username or Password.', 'Error!');
    } else if (error.status === 400) {
      this.toastr.error(
        'Something went wrong, please try again later.',
        'Error!'
      );
    } else {
      this.toastr.error(
        error.error.errorMessage !== undefined
          ? error.error.errorMessage
          : 'Login failed',
        'Error!'
      );
    }
  }

  checkPasswords(form: FormGroup) {
    // here we have the 'passwords' group
    const pass = form.value.password;
    const confirmPass = form.value.confirmPassword;
    return pass === confirmPass ? null : { notSame: true };
  }
}
