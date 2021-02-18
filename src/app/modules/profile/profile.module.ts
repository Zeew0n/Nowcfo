import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { UserProfile } from './components/user-profile/user-profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [
        UserProfile
    ],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule,
        NgSelectModule
    ],
    providers: []
})
export class Profile { }
