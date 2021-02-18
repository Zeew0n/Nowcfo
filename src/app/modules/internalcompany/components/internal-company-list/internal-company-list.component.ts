import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { InternalCompanyService } from '../../services/internal-company.service';
import { InternalCompanyModel } from '../../../../models/internal-company.model';
import { faSleigh } from '@fortawesome/free-solid-svg-icons';
import { EMPTY } from 'rxjs';
import AuthenticationService from '../../../user-account/services/authentication.service';
import { Permission } from '../../../../constants/permission';
import { create } from 'domain';
import { RoleModel } from 'src/app/models/role.model';
@Component({
    selector: 'app-internal-company-list',
    templateUrl: './internal-company-list.component.html',
})

export class InternalCompanyListComponent {
    company: InternalCompanyModel = new InternalCompanyModel();
    companies: InternalCompanyModel[];
    roles: RoleModel[];

    isSubmitting: boolean; // Form submission variable
    closeResult = ''; // close result for modal
    submitted = false;
    userId: string = '';
    isEdit: boolean = false;
    selectedSimpleItem = 'User';
    websiteList: any = ['User', 'Admin']
    simpleItems = [];
    isUpdate=false;
    selectCompany;


    
    //roleId: string='';
   // roleName: string='';



    constructor(
        private fb: FormBuilder,
        private  modalService: NgbModal,
        private toastr: ToastrService,
        private internalCompanyService: InternalCompanyService,
  
        private authService: AuthenticationService,
        private route: ActivatedRoute) {
         }
        /* Form Declarations */
        UserForm: FormGroup;
        EventValue: any = 'Save';
        //isActive: boolean;
        //updatedDate: Date;
        //createdDate: Date;
        hasUser: boolean = false;
        hasAdmin: boolean = false;
        hasSuperAdmin: boolean = false;

        userName = new FormControl();
        firstName = new FormControl('', [Validators.required]);
        lastName = new FormControl('', [Validators.required]);
        email = new FormControl();
        confirmEmail = new FormControl();
        phoneNumber = new FormControl('', [Validators.required]);
        password = new FormControl();
        confirmPassword= new FormControl();
        roleId = new FormControl(true, [Validators.required]);
        tenantId= new FormControl();

      ngOnInit()
     {
        this.getIC();
        this.initializeCompanyForm();
        this.getRoles();
       // this.getTenants();
        //this.simpleItems = ['User', 'Admin'];
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

    
    get f() { return this.UserForm.controls; }

    getIC() {
        this.internalCompanyService.GetAllUsers().subscribe(result => {
            this.companies = result;
        }, error => console.error);
    }
    

    getRoles() {
      this.internalCompanyService.GetAllRoles().subscribe(result => {
          this.roles = result;
      }, error => console.error);
  }



        initializeCompanyForm() {
        this.UserForm = new FormGroup({
           // userId: this.userId,
            userName : this.userName,
            firstName : this.firstName,
            lastName : this.lastName,
            email : this.email,
            confirmEmail: this.confirmEmail,
            phoneNumber : this.phoneNumber,
            password : this.password,
            confirmPassword:this.confirmPassword,
            roleId : this.roleId,
            tenantId: this.tenantId,
        });
    }

    changeWebsite(e) {
      console.log(e.target.value);
    }


    changerole(e) {
      console.log(e.target.value);
    }
    
    changetenant(e) {
      console.log(e.target.value);
    }


    Delete(id)
    {
      debugger
      console.log("Hello Ashok!")
        this.internalCompanyService.DeleteUser(id).subscribe(result =>
            {

               if ( confirm (' Are you sure to delete this record ')){
               if (result == null)
               {
                this.modalService.dismissAll();
                this.toastr.success('User Delete Successfully.', 'Success!');
                this.getIC();
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
     this.userId = '';
     this.company == null;
     this.openModal(content);
    }

    onSubmit() {
    debugger;

    const createForm = this.UserForm.value;
    console.log(createForm)

        if (!this.isUpdate) {

          if (this.UserForm.valid)
          {
                const model = new InternalCompanyModel();
                debugger;
                model.userName= createForm.userName;
                model.firstName= createForm.firstName;
                model.lastName= createForm.lastName;
                model.email= createForm.email;
                model.confirmEmail= createForm.confirmEmail;
                model.password= createForm.password;
                model.confirmPassword= createForm.confirmPassword;
                model.roleId= createForm.roleId;
                model.tenantId= createForm.tenantId;
                model.phoneNumber= createForm.phoneNumber;

                this.internalCompanyService.CreateUser(model).subscribe(
                (res) => {
                    this.submitted = true;
                    this.toastr.success('User Added Successfully.', 'Success!');
                    this.modalService.dismissAll();
                    this.getIC();
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
              if (this.UserForm.valid)
                  {
                    const model = new InternalCompanyModel();
                    debugger;
                        //model.userName= createForm.userName;
                        model.firstName= createForm.firstName;
                        model.lastName= createForm.lastName;
                       // model.email= createForm.email;
                       // model.confirmEmail= createForm.confirmEmail;
                        //model.password= createForm.password;
                        //model.confirmPassword= createForm.confirmPassword;
                        model.roleId= createForm.roleId;
                        model.tenantId= createForm.tenantId
                        model.phoneNumber= createForm.phoneNumber;
                        model.id = this.selectCompany.id;
                      this.internalCompanyService.updateUser(model).subscribe(
                       (res) => {
                         this.toastr.success('User Updated Successfully.', 'Success!');
                         this.modalService.dismissAll();
                         this.getIC();

                       },
                       error => {
                         this.toastr.error(error.error.errorMessage !== undefined ?
                           error.error.errorMessage : 'User Update failed', 'Error!');
                       });
                       
                   }

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
            this.UserForm.reset();
            this.EventValue = 'Save';
            this.submitted = false;
            this.company == null;
        }


        EditData(content, company: any)
        {
          this.isUpdate = true;
          this.isEdit=true;

          this.selectCompany = company;
          debugger;
          console.log(company);
            //this.resetFrom();
            this.EventValue ='Update';
            this.UserForm.patchValue({
             userName: company.userName,
             firstName: company.firstName,
             lastName:company.lastName,
             email: company.email,
             confirmEmail:company.email,
             roleId:company.role,
             tenantId:company.tenantId,
             phoneNumber:company.phoneNumber,

            });
            this.modalService.open(content,{size:'md',backdrop:'static'});
            // this.userId = userId;
            // this.getCompanyById(userId, content);
       }      
       
       getCompanyById(userid: string, content) {
          
         this.internalCompanyService.GetUserById(userid).subscribe(
          (res: InternalCompanyModel) => {
            this.isEdit = true;
            this.EventValue ='Update';
            this.displayFormData(res);
            this.openModal(content);
          },
          error => {
            this.toastr.error(error.error.errorMessage !== undefined ?
              error.error.errorMessage : 'User Create failed', 'Error!');
          });
      }

      private openModal(content: any) {
         this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-gosend modal-right' }).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }
      private displayFormData(data: InternalCompanyModel) {
        this.UserForm.patchValue({

          userName : data.userName,
          firstName : data.firstName,
          lastName : data.lastName,
          email : data.email,
          confirmEmail: data.confirmEmail,
          phoneNumber : data.phoneNumber,
          password : data.password,
          confirmPassword: data.confirmPassword,
          roleName : data.role,
          organizationName:data.organizationName

        });
      }
}
