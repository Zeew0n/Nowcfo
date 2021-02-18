import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent} from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SignupComponent } from './components/signup/signup.component';
import { ConfirmSignupComponent } from './components/confirm-signup/confirm-signup.component';
import { UserAccountRoutingModule } from './user-account-routing.module';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

@NgModule({
    imports: [
        CommonModule,
        UserAccountRoutingModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [LoginComponent, LoginPageComponent, SignupComponent],
    providers: []
})
export class UserAccountModule { }
