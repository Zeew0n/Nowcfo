import { Component, Output, EventEmitter, } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import AuthenticationService from '../../../user-account/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-side-nav',
    templateUrl: './side-nav.component.html',
    styleUrls: ['./sidebar.scss']
})

export class SideNavComponent {

    hasUser: boolean = true;
    hasAdmin: boolean = false;
    hasSuperAdmin: boolean = false;
    sidebarInner : boolean =false;

    constructor(
        private fb: FormBuilder,
        private  modalService: NgbModal,
        private toastr: ToastrService,
        private authService: AuthenticationService,
        private route: ActivatedRoute) {
         }

         private checkPermissions() {
            const role = this.authService.getUserRole();

            if (role=="User") {
              this.hasUser = true;
            } else {
              this.hasUser = false;
            }
            if (role=="Admin") {
                this.hasAdmin = true;
              } else {
                this.hasAdmin = false;
              }

              if (role=="SuperAdmin") {
                this.hasSuperAdmin = true;
              } else {
                this.hasSuperAdmin = false;
              }
          }
    
          private checkPermission(user): boolean {
            return this.authService.checkPermission(user);
          }




}
