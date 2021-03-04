import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppLayoutComponent } from './_layouts/app-layout/app-layout.component';
import { LoginPageComponent } from './modules/user-account/components/login-page/login-page.component';
import { ForgotPasswordComponent } from './modules/user-account/components/forgot-password/forgot-password.component';
import { SignupComponent } from './modules/user-account/components/signup/signup.component';
import { HomePageComponent } from './modules/home/components/home-page/home-page.component';
import { ResetPasswordComponent } from './modules/user-account/components/reset-password/reset-password.component';
import { ConfirmSignupComponent } from './modules/user-account/components/confirm-signup/confirm-signup.component';
import { AuthGuard } from './services/_guards/auth-guard';
export const routes: Routes = [
    { path: '', component: LoginPageComponent },
    { path: 'login', component: LoginPageComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    {
        path: 'updatepassword/:uid/:email/:uname/:token',
        component: ResetPasswordComponent
    },

    {
        path: 'confirm/:uid/:uname/:token',
        component: ConfirmSignupComponent
    },

    {
        path: '',
        component: AppLayoutComponent,
        children: [
            // { path: '', component: HomePageComponent, pathMatch: 'full', canActivate: [AuthGuard] },
            {
                path: 'home',
                loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
                canActivate: [AuthGuard]

            },
            {
                path: 'emp-roles',
                loadChildren: () => import('./modules/employeeroles/employeerole.module').then(m => m.EmployeeRoleModule),
                canActivate: [AuthGuard]

            },

            {
                path: 'user-information',
                loadChildren: () => import('./modules/userinformation/userinformation.module').then(m => m.UserInformationModule),
                canActivate: [AuthGuard]
            },

            {
                path: 'employee-information',
                loadChildren: () => import('./modules/employee/employee.module').then(m => m.EmployeeModule),
                canActivate: [AuthGuard]
            },

            {
                path: 'organization-information',
                loadChildren: () => import('./modules/organization/organization.module').then(m => m.OrganizationModule),
                canActivate: [AuthGuard]
            },
           
        ]
    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule { }
