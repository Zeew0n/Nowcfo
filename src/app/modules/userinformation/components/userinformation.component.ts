import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleModel } from 'src/app/models/role.model';
import { UserInformationService } from '../services/userinformation.service';
import AuthenticationService from '../../user-account/services/authentication.service';
import { UserInformationModel } from 'src/app/models/userinformation.model';
@Component({
    selector: 'app-userinformation-list',
    styleUrls:['userinformation.component.scss'],
    templateUrl: './userinformation.component.html',
})

export class UserInformationComponent{

    userinformation: UserInformationModel = new UserInformationModel();
    userinformations: UserInformationModel[];
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
    selectuserinformation;

    constructor(
        private fb: FormBuilder,
        private  modalService: NgbModal,
        private toastr: ToastrService,
        private userInformationService: UserInformationService,
  
        private authService: AuthenticationService,
        private route: ActivatedRoute) {
         }

        /* Form Declarations */
        userForm: FormGroup;
        EventValue: any = 'Save';
        //isActive: boolean;
        hasUser: boolean = false;
        hasAdmin: boolean = false;
        hasSuperAdmin: boolean = false;




        userName = new FormControl('', [Validators.required]);
        email = new FormControl('',Validators.email);
        phoneNumber = new FormControl('', [Validators.required]);
        firstName = new FormControl('', [Validators.required]);
        lastName = new FormControl('', [Validators.required]);
        password = new FormControl('', [Validators.required]);
        address= new FormControl('', [Validators.required]);
        city= new FormControl('', [Validators.required]);
        //state= new FormControl('', [Validators.required]);
        zipCode= new FormControl('', [Validators.required]);

        roleId = new FormControl(true, [Validators.required]);

      ngOnInit()
     {
      //  this.userForm.controls.password.setValidators(null);
        this.getUsers();
        this.initializeuserinformationForm();
        this.getRoles();
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

    
    get f() { return this.userForm.controls; }

    getUsers() {
        this.userInformationService.GetAllUsers().subscribe(result => {
            this.userinformations = result;
        }, error => console.error);
    }
    

    getRoles() {
      this.userInformationService.GetAllRoles().subscribe(result => {
          this.roles = result;
      }, error => console.error);
  }



        initializeuserinformationForm() {
        this.userForm = new FormGroup({
            userName : this.userName,
            firstName:this.firstName,
            lastName:this.lastName,
            password:this.password,
            email : this.email,
            phoneNumber : this.phoneNumber,
            address:this.address,
            city:this.city,
            //state:this.state,
            zipCode:this.zipCode,
            roleId : this.roleId
        });
    }


    changerole(e) {
      console.log(e.target.value);
    }
    


    Delete(id)
    {
      debugger
      console.log("Hello Ashok!")
        this.userInformationService.DeleteUser(id).subscribe(result =>
            {

               if ( confirm (' Are you sure to delete this record? ')){
               if (result == null)
               {
                this.modalService.dismissAll();
                this.toastr.success('User Delete Successfully.', 'Success!');
                this.getUsers();
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
     this.userinformation == null;
     this.openModal(content);
    }

    onSubmit() {
    debugger;

    const createForm = this.userForm.value;
    console.log(createForm)

        if (!this.isUpdate) {

          if (this.userForm.valid)
          {
                const model = new UserInformationModel();
                debugger;
                model.userName= createForm.userName;
                model.firstName= createForm.firstName;
                model.lastName= createForm.lastName;
                model.email= createForm.email;
                //model.confirmEmail= createForm.confirmEmail;
                model.password= createForm.password;
                //model.confirmPassword= createForm.confirmPassword;
                model.roleId= createForm.roleId;
                model.phoneNumber= createForm.phoneNumber;
                model.address= createForm.address;
                model.city= createForm.city;
               // model.state= createForm.state;
                model.zipCode=createForm.zipCode;

                this.userInformationService.CreateUser(model).subscribe(
                (res) => {
                    this.submitted = true;
                    this.toastr.success('User Added Successfully.', 'Success!');
                    this.modalService.dismissAll();
                    this.getUsers();
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
              if (!this.userForm.valid)
                  {
                    const model = new UserInformationModel();
                    debugger;

                        model.roleId= createForm.roleId;
                        model.phoneNumber= createForm.phoneNumber;
                        model.address= createForm.address;
                        model.firstName= createForm.lastName;
                        model.lastName= createForm.lastName;
                        model.city= createForm.city;
                        model.userName= createForm.userName;
                        model.email= createForm.email;
                       // model.state= createForm.state;
                        model.zipCode=createForm.zipCode;
                        model.id = this.selectuserinformation.id;
                      this.userInformationService.updateUser(model).subscribe(
                       (res) => {
                         this.toastr.success('User Updated Successfully.', 'Success!');
                         this.modalService.dismissAll();
                         this.getUsers();

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
            this.userForm.reset();
            this.EventValue = 'Save';
            this.submitted = false;
            this.userinformation == null;
        }


        EditData(content, userinformation: any)
        {
          this.isUpdate = true;
          this.isEdit=true;
          this.selectuserinformation = userinformation;
          debugger;
          console.log(userinformation);
            this.EventValue ='Update';
            this.userForm.patchValue({
             userName: userinformation.userName,
             firstName: userinformation.firstName,
             lastName: userinformation.lastName,
             email: userinformation.email,
             roleId:userinformation.roleId,
             phoneNumber:userinformation.phoneNumber,
             address:userinformation.address,
             city: userinformation.city,
             //state:userinformation.state,
             zipCode:userinformation.zipCode,


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
