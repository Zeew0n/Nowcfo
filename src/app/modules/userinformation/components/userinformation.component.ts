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


    
    //roleId: string='';
   // roleName: string='';



    constructor(
        private fb: FormBuilder,
        private  modalService: NgbModal,
        private toastr: ToastrService,
        private userInformationService: UserInformationService,
  
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
        email = new FormControl();
        phoneNumber = new FormControl('', [Validators.required]);
        password = new FormControl();
        roleId = new FormControl(true, [Validators.required]);
       // tenantId= new FormControl();

      ngOnInit()
     {
        this.getIC();
        //console.log(a);
        this.initializeuserinformationForm();
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
        this.UserForm = new FormGroup({
           // userId: this.userId,
            userName : this.userName,
            password:this.password,
            email : this.email,
            phoneNumber : this.phoneNumber,
            roleId : this.roleId
        });
    }

    changeWebsite(e) {
      console.log(e.target.value);
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
     this.userinformation == null;
     this.openModal(content);
    }

    onSubmit() {
    debugger;

    const createForm = this.UserForm.value;
    console.log(createForm)

        if (!this.isUpdate) {

          if (this.UserForm.valid)
          {
                const model = new UserInformationModel();
                debugger;
                model.userName= createForm.userName;
                model.email= createForm.email;
               // model.confirmEmail= createForm.confirmEmail;
                model.password= createForm.password;
               // model.confirmPassword= createForm.confirmPassword;
                model.roleId= createForm.roleId;
                model.phoneNumber= createForm.phoneNumber;

                this.userInformationService.CreateUser(model).subscribe(
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
                    const model = new UserInformationModel();
                    debugger;
                        //model.userName= createForm.userName;
                        //model.firstName= createForm.firstName;
                        //model.lastName= createForm.lastName;
                       // model.email= createForm.email;
                       // model.confirmEmail= createForm.confirmEmail;
                        //model.password= createForm.password;
                        //model.confirmPassword= createForm.confirmPassword;
                        model.roleId= createForm.roleId;
                        //model.tenantId= createForm.tenantId
                        model.phoneNumber= createForm.phoneNumber;
                        model.id = this.selectuserinformation.id;
                      this.userInformationService.updateUser(model).subscribe(
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
            this.userinformation == null;
        }


        EditData(content, userinformation: any)
        {
          this.isUpdate = true;
          this.isEdit=true;

          this.selectuserinformation = userinformation;
          debugger;
          console.log(userinformation);
            //this.resetFrom();
            this.EventValue ='Update';
            this.UserForm.patchValue({
             userName: userinformation.userName,
             email: userinformation.email,
             roleId:userinformation.role,
             phoneNumber:userinformation.phoneNumber,

            });
            this.modalService.open(content,{size:'md',backdrop:'static'});
            // this.userId = userId;
            // this.getuserinformationById(userId, content);
       }      
       
       getuserinformationById(userid: string, content) {
          
         this.userInformationService.GetUserById(userid).subscribe(
          (res: UserInformationModel) => {
            this.isEdit = true;
            this.EventValue ='Update';
            //this.displayFormData(res);
            this.openModal(content);
          },
          error => {
            this.toastr.error(error.error.errorMessage !== undefined ?
              error.error.errorMessage : 'User Create failed', 'Error!');
          });
      }

      private openModal(content: any) {
         this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-cfo' }).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }
     
}



//     roles: RoleModel[];

//     isSubmitting: boolean; // Form submission variable
//     closeResult = ''; // close result for modal
//     submitted = false;
//     userId: string = '';
//     isEdit: boolean = false;
//     selectedSimpleItem = 'User';
//     websiteList: any = ['User', 'Admin']
//     simpleItems = [];
//     isUpdate = false;
//     selectuserinformation;
//     constructor(
//         private modalService: NgbModal) { }
//     open(content) {
//         this.isUpdate = false;
//         this.isEdit = false;
//         this.userId = '';
//         this.openModal(content);
//     }

//     onSubmit() {
//         debugger;
//     }
//     private getDismissReason(reason: any): string {
//         if (reason === ModalDismissReasons.ESC) {
//             return 'by pressing ESC';
//         } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
//             return 'by clicking on a backdrop';
//         } else {
//             return `with: ${reason}`;
//         }
//     }

//     private openModal(content: any) {
//         this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-cfo' }).result.then((result) => {
//             this.closeResult = `Closed with: ${result}`;
//         }, (reason) => {
//             this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
//         });
//     }

// }
