import {Component} from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal,ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleModel } from 'src/app/models/role.model';
import { RoleService } from '../services/userrole.service';
import AuthenticationService from '../../user-account/services/authentication.service';
@Component({
  selector: 'app-userrole',
  styleUrls: ['userrole.component.scss'],
  templateUrl: './userrole.component.html',
})
export class UserRoleComponent {
  role: RoleModel = new RoleModel();
  roles: RoleModel[];

  isSubmitting: boolean; // Form submission variable
  closeResult = ''; // close result for modal
  submitted = false;

  isEdit = false;
  isUpdate = false;

  selectrole;
  selectedRole: number;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private roleService: RoleService,
    private authService: AuthenticationService,
    private route: ActivatedRoute
  ) {}

  /* Form Declarations */
  roleForm: FormGroup;
  EventValue: any = 'Save';

 roleId = new FormControl('');
  roleName = new FormControl('', [Validators.required]);
  //isActive = new FormControl(true);

  ngOnInit() {
    this.getRoles();
    this.initializeUserRoleForm();
  }

  getRoles() {
    this.roleService.GetAllRoles().subscribe(
      (result) => {
        this.roles = result;
      },
      (error) => console.error
    );
  }

  initializeUserRoleForm() {
    this.roleForm = new FormGroup({
      roleId: this.roleId,
      roleName: this.roleName
    });
  }
  openDeleteModal(content, id) {
    this.EventValue = 'Delete';
    this.selectedRole = id;
    this.openModal(content);
  }

  Delete() {
    debugger
    this.roleService.DeleteRole(this.selectedRole).subscribe(
      (result) => {
        if (result == null) {
          this.modalService.dismissAll();
          this.toastr.success('Role deleted successfully.', 'success!');
          this.getRoles();
        } else {
          this.toastr.success('something went wrong.', 'error!');
        }
      },
      (error) => {
        console.log(error.errorMessage);
        this.toastr.error('Cannot delete role', 'error!');
      }
    );
  }
  open(content) {
    this.isUpdate = false;
    this.resetFrom();
    this.isEdit = false;
    this.role = null;
    this.openModal(content);
  }

  onSubmit() {
    debugger
    const createForm = this.roleForm.value;
    console.log(createForm);

    if (!this.isEdit) {
      if (this.roleForm.valid) {
        const model = new RoleModel();

        model.roleName = createForm.roleName;
        //model.isActive= createForm.isActive ? true : false;
        this.roleService.CreateRole(model).subscribe(
          (res) => {
            this.submitted = true;
            this.toastr.success('Role Added Successfully.', 'Success!');
            this.modalService.dismissAll();
            this.getRoles();
          },
          (error) => {
            console.log(error);
            this.isSubmitting = false;
            this.modalService.dismissAll();
            this.toastr.error(error.error.errorMessage, 'Error!');
          }
        );
      }
    } else {

      if (this.roleForm.valid) {

     const model = new RoleModel();
     debugger

     model.roleName = createForm.roleName;
    // model.isActive = createForm.isActive;
     model.roleId = createForm.roleId;

     this.roleService.UpdateRole(model).subscribe(
        (res) => {
          this.toastr.success('Role Updated Successfully.', 'Success!');
          this.modalService.dismissAll();
          this.getRoles();
        },
        (error) => {
          this.toastr.error(
            error.error.errorMessage !== undefined
              ? error.error.errorMessage
              : 'Role Update failed',
            'Error!'
          );
        }
      );
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

  resetFrom() {
    this.roleForm.reset();
    this.EventValue = 'Save';
    this.submitted = false;
    this.role = null;
  }

  EditData(content, role: any) {
    debugger
    this.isUpdate = true;
    this.isEdit = true;
    this.selectrole = this.role;
    this.EventValue = 'Update';
    this.roleForm.patchValue({
      roleName: role.roleName,
      roleId: role.roleId
    });
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'modal-cfo',
      backdropClass:'static'
    });
  }

  private openModal(content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'modal-cfo',
        backdrop: 'static'
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
}
