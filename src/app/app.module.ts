import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  NgxUiLoaderRouterModule,
} from 'ngx-ui-loader';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { UserAccountModule } from './modules/user-account/user-account.module';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SideNavComponent } from './modules/navigation/components/side-nav/side-nav.component';
import { TopNavComponent } from './modules/navigation/components/top-nav/top-nav.component';
import { AppLayoutComponent } from './_layouts/app-layout/app-layout.component';
import { HomeModule } from './modules/home/home.module';
import { JwtModule } from '@auth0/angular-jwt';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TokenInterceptor } from './services/_interceptors/token.interceptor';
import { AppLoginComponent } from './_layouts/app-login/app-login.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { ForgotPasswordComponent } from './modules/user-account/components/forgot-password/forgot-password.component';
//import { UserProfile } from './modules/profile/components/user-profile/user-profile.component';
//import { UsersManagement } from './modules/users/components/users-management/users-management.component';
import { HomePageComponent } from './modules/home/components/home-page/home-page.component';
import { ConfirmSignupComponent } from './modules/user-account/components/confirm-signup/confirm-signup.component';
import { ResetPasswordComponent } from './modules/user-account/components/reset-password/reset-password.component';
import { UserInformationComponent } from './modules/userinformation/components/userinformation.component';
import { OrganizationComponent } from './modules/organization/components/organization.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { EmployeeComponent } from './modules/employee/components/employee.component';
import { EmployeeRoleComponent } from './modules/employeeroles/components/employeerole.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: 'red',
  bgsPosition: POSITION.bottomCenter,
  bgsSize: 40,
  fgsType: SPINNER.rectangleBounce,
  // logoUrl: '../assets/images/logo.svg',
  logoPosition: 'center-center',
  logoSize: 250,
  pbColor: '#ffffff',
  fgsColor: '#ffffff',
};
export function tokenGetter() {
  return localStorage.getItem('access_token');
}
@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    SideNavComponent,
    TopNavComponent,
    AppLayoutComponent,
    AppLoginComponent,
    ForgotPasswordComponent,
    ConfirmSignupComponent,
    ResetPasswordComponent,
    UserInformationComponent,
    OrganizationComponent,
    EmployeeComponent,
    EmployeeRoleComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    RouterModule.forRoot([]),
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgMultiSelectDropDownModule.forRoot(),
    HomeModule,
    HttpClientModule,
    NgbModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule,
    UserAccountModule,
    NgSelectModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      closeButton: true,
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['example.com'],
        disallowedRoutes: ['http://example.com/examplebadroute/'],
      },
    }),
    NgxPaginationModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],

  //Comment  
  bootstrap: [AppComponent],
})
export class AppModule {}
