import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import AuthenticationService from '../../user-account/services/authentication.service';
import { OrganizationService } from '../services/organization.service';
import { OrganizationModel } from 'src/app/models/organization.model';
@Component({
    selector: 'app-organization-list',
    styleUrls:['organization.component.scss'],
    templateUrl: './organization.component.html',
})

export class OrganizationComponent{

    organization: OrganizationModel = new OrganizationModel();
    //for list of Organizations
    //for list of Organizations
    organizations: OrganizationModel[];

    //for dropdownlist
    organizationdropdownlists: OrganizationModel[];


    isSubmitting: boolean; // Form submission variable
    closeResult = ''; // close result for modal
    submitted = false;




    organizationId: string = '';
    isEdit: boolean = false;
    isUpdate=false;
    
    selectorganization;

    constructor(
        private fb: FormBuilder,
        private  modalService: NgbModal,
        private toastr: ToastrService,
        private organizationService: OrganizationService,
  
        private authService: AuthenticationService,
        private route: ActivatedRoute) {
         }

        /* Form Declarations */
        OrganizationForm: FormGroup;
        EventValue: any = 'Save';
        //isActive: boolean;
        hasUser: boolean = false;
        hasAdmin: boolean = false;
        hasSuperAdmin: boolean = false;



        organizationName = new FormControl('', [Validators.required]);
        isHeadOrganization = new FormControl();
        parentOrganizationId = new FormControl();

      ngOnInit()
     {
      //  this.UserForm.controls.password.setValidators(null);
        this.getOrganizations();
        this.initializeorganizationForm();
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

    
    get f() { return this.OrganizationForm.controls; }

    getOrganizations() {
        this.organizationService.GetAllOrganizations().subscribe(result => {
            this.organizations = result;
        }, error => console.error);
    }
    

 



        initializeorganizationForm() {
        this.OrganizationForm = new FormGroup({
            organizationName : this.organizationName,
            isHeadOrganization:this.isHeadOrganization,
            parentOrganizationId:this.parentOrganizationId,
        
        });
    }


    changeorganization(e) {
      console.log(e.target.value);
    }
    


    Delete(id)
    {
      debugger
      console.log("Hello Ashok!")
        this.organizationService.DeleteOrganization(id).subscribe(result =>
            {

               if ( confirm (' Are you sure to delete this record? ')){
               if (result == null)
               {
                this.modalService.dismissAll();
                this.toastr.success('Organization Delete Successfully.', 'Success!');
                this.getOrganizations();
               }
               else{
                this.toastr.success('Something went Wrong.', 'Error!');
               }
            }
            

            },
            error => {
                console.log(error);
                this.toastr.error(error.error.errorMessage, 'Error!');
            });
    }

    open(content) {
      this.isUpdate = false;
     this.resetFrom();
     this.isEdit = false;
     this.organizationId = '';
     this.organization == null;
     this.openModal(content);
    }

    onSubmit() {
    debugger;

    const createForm = this.OrganizationForm.value;
    console.log(createForm)

        if (!this.isUpdate) {

          if (this.OrganizationForm.valid)
          {
                const model = new OrganizationModel();
                debugger;
                model.organizationName= createForm.organizationName;
                model.isHeadOrganization= createForm.isHeadOrganization;
              
                model.parentOrganizationId= createForm.parentOrganizationId;

                this.organizationService.CreateOrganization(model).subscribe(
                (res) => {
                    this.submitted = true;
                    this.toastr.success('User Added Successfully.', 'Success!');
                    this.modalService.dismissAll();
                    this.getOrganizations();
                },
                error => {
                    console.log(error);
                    this.isSubmitting = false;
                    this.modalService.dismissAll();
                    this.toastr.error(error.error.errorMessage, 'Error!');
                 });
            }
        }
            else
            {
              // if (!this.OrganizationForm.valid)
              //     {
                    const model = new OrganizationModel();
                    debugger;

                        model.parentOrganizationId= createForm.parentOrganizationId;
                        model.organizationName= createForm.organizationName;
                        model.isHeadOrganization= createForm.isHeadOrganization;
                        model.id = this.selectorganization.id;
                      this.organizationService.UpdateOrganization(model.id,model).subscribe(
                       (res) => {
                         this.toastr.success('Organization Updated Successfully.', 'Success!');
                         this.modalService.dismissAll();
                         this.getOrganizations();

                       },
                       error => {
                         this.toastr.error(error.error.errorMessage !== undefined ?
                           error.error.errorMessage : 'Organization Update failed', 'Error!');
                       });
                       
                  // }

        }
           

    }


        private getDismissReason(reason: any): string {
            if (reason === ModalDismissReasons.ESC) {
                return 'by pressing ESC';
            } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
                return 'by clicking on a backdrop';
            } else {
                return `with: ${reason}`;
            }
        }


        resetFrom()
        {
            this.OrganizationForm.reset();
            this.EventValue = 'Save';
            this.submitted = false;
            this.organization == null;
        }


        EditData(content, organization: any)
        {
          this.isUpdate = true;
          this.isEdit=true;
          this.selectorganization = organization;
          debugger;
          console.log(organization);
            this.EventValue ='Update';
            this.OrganizationForm.patchValue({
             organizationName: organization.organizationName,
             isHeadOrganization: organization.isHeadOrganization,
             parentOrganizationId: organization.parentOrganizationId,
            });
            this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-cfo' });
       }      

      private openModal(content: any) {
         this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-cfo' }).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }
     
  

}
