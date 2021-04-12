import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent} from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SignupComponent } from './components/signup/signup.component';
import { ConfirmSignupComponent } from './components/confirm-signup/confirm-signup.component';
import { UserAccountRoutingModule } from './user-account-routing.module';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { UserInformationComponent } from './components/user-information/userinformation.component';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UserRoleComponent } from './components/user-role/userrole.component';
import { SideNavComponent } from '../navigation/components/side-nav/side-nav.component';
import { AdminUserComponent } from './components/admin-user/admin-user.component';

@NgModule({
    imports: [
        CommonModule,
        UserAccountRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        ToastrModule,
        NgMultiSelectDropDownModule,
        
    ],
    declarations: [LoginComponent, LoginPageComponent, SignupComponent, ChangePasswordComponent,UserInformationComponent,UserRoleComponent, AdminUserComponent],
    providers: []
})
export class UserAccountModule { }
