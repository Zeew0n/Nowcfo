import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppLayoutComponent } from './shared/_layouts/app-layout/app-layout.component';
import { LoginPageComponent } from './modules/user-account/components/login-page/login-page.component';
import { ForgotPasswordComponent } from './modules/user-account/components/forgot-password/forgot-password.component';
import { SignupComponent } from './modules/user-account/components/signup/signup.component';
import { ResetPasswordComponent } from './modules/user-account/components/reset-password/reset-password.component';
import { ConfirmSignupComponent } from './modules/user-account/components/confirm-signup/confirm-signup.component';
import { AuthGuard } from './shared/_guards/auth-guard';
import { PageNotFoundComponent } from './modules/shared/page-not-found/page-not-found.component';
export const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: '404Error', component: PageNotFoundComponent },

  {
    path: 'updatepassword/:uid/:email/:uname/:token',
    component: ResetPasswordComponent,
  },
  {
    path: 'confirm/:uid/:uname/:token',
    component: ConfirmSignupComponent,
  },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./modules/home/home.module').then((m) => m.HomeModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'employee',
        loadChildren: () =>
          import('./modules/employee/employee.module').then(
            (m) => m.EmployeeModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./modules/user-account/user-account.module').then(
            (m) => m.UserAccountModule
          ),
          canActivate: [AuthGuard],
      },
      {
        path: 'organization-information',
        loadChildren: () =>
          import('./modules/organization/organization.module').then(
            (m) => m.OrganizationModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'market',
        loadChildren: () =>
          import('./modules/market/market.module').then(
            (m) => m.MarketModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'sales',
        loadChildren: () =>
          import('./modules/sales-forecast/sales-forecast.module').then(
            (m) => m.SalesForecastModule
          ),
        canActivate: [AuthGuard],
      }
    ],
  },

  { path: '**', redirectTo: '/404Error' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule { }
