import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleModel } from 'src/app/models/role.model';
import { MenuModel } from 'src/app/models/menu.model';
import { RolePermissionModel } from 'src/app/models/role-permission';
import { RoleService } from '../../services/userrole.service';
import AuthenticationService from '../../services/authentication.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-userrole',
  styleUrls: ['userrole.component.scss'],
  templateUrl: './userrole.component.html',
})
export class UserRoleComponent implements OnInit {
  role: RoleModel = new RoleModel();
  roles: RoleModel[];
  menuList: MenuModel[];
  checkedMenuList: MenuModel[] = [];
  dropdownPermissionSettings;
  rolePermissionForm: FormGroup;

  isSubmitting: boolean; // Form submission variable
  closeResult = ''; // close result for modal
  submitted = false;

  isEdit = false;
  disableRoleDdl = false;
  selectrole;
  selectedRole: number;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private roleService: RoleService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private ngxLoaderService: NgxUiLoaderService,
  ) {}

  /* Form Declarations */
  roleForm: FormGroup;
  EventValue: any = 'Save';

  roleId = new FormControl('');
  roleName = new FormControl('', [Validators.required]);

  ngOnInit() {
    this.getRoles();
    this.getMenus();
    this.initializeUserRoleForm();
    this.initializeRolePermissionForm();
    this.dropdownPermissionSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'menuName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }

  getRoles() {
    this.roleService.getAllRoles().subscribe(
      (result) => {
        this.roles = result;
        console.table(this.roles);
      },
      (error) => console.error
    );
  }
  getMenus() {
    this.roleService.getAllMenus().subscribe(
      (result) => {
        this.menuList = result;
        console.table(this.menuList);
      },
      (error) => console.error
    );
  }
  getRoleById(id: string, content) {
    this.roleService.getRoleById(id).subscribe(
      (result: RoleModel) => {
        this.isEdit = true;
        this.EventValue = 'Update';
        this.displayFormData(result, id);
        this.openModal(content);
      },
      (error) => {
        this.toastr.error(
          error.error.errorMessage !== undefined
            ? error.error.errorMessage
            : ' failed',
          'Error!'
        );
      }
    );
  }
  displayFormData(data: RoleModel, id: any) {
    this.rolePermissionForm.patchValue({
      roleId: data.roleId,
    });
  }

  initializeRolePermissionForm() {
    this.rolePermissionForm = this.fb.group({
      roleId: new FormControl(''),
      menuIds: new FormControl(''),
    });
  }

  initializeUserRoleForm() {
    this.roleForm = new FormGroup({
      roleId: this.roleId,
      roleName: this.roleName,
    });
  }
  openDeleteModal(content, id) {
    this.EventValue = 'Delete';
    this.selectedRole = id;
    this.openModal(content);
  }

  Delete() {
    this.roleService.DeleteRole(this.selectedRole).subscribe(
      (result) => {
        if (result == null) {
          this.modalService.dismissAll();
          this.toastr.success('Role deleted successfully.', 'success!');
          this.getRoles();
          this.ngxLoaderService.stop();
        } else {
          this.toastr.success('something went wrong.', 'error!');
          this.ngxLoaderService.stop();
        }
      },
      (error) => {
        console.log(error.errorMessage);
        this.toastr.error('Cannot delete role', 'error!');
      }
    );
  }
  open(content) {
    this.resetFrom();
    this.isEdit = false;
    this.role = null;
    this.openModal(content);
  }

  onSubmit() {
    this.ngxLoaderService.start();
    const createForm = this.roleForm.value;
    console.log(createForm);
    if (!this.isEdit) {
      if (this.roleForm.valid) {
        const model = new RoleModel();
        model.roleName = createForm.roleName;
        this.roleService.CreateRole(model).subscribe(
          (res) => {
            this.submitted = true;
            this.toastr.success('Role Added Successfully.', 'Success!');
            this.modalService.dismissAll();
            this.getRoles();
            this.ngxLoaderService.stop();
          },
          (error) => {
            console.log(error);
            this.isSubmitting = false;
            this.modalService.dismissAll();
            this.toastr.error(error.error.errorMessage, 'Error!');
            this.ngxLoaderService.stop();
          }
        );
      }
    } else {
      if (this.roleForm.valid) {
        const model = new RoleModel();
        model.roleName = createForm.roleName;
        model.roleId = createForm.roleId;

        this.roleService.UpdateRole(model).subscribe(
          (res) => {
            this.toastr.success('Role Updated Successfully.', 'Success!');
            this.modalService.dismissAll();
            this.getRoles();
            this.ngxLoaderService.stop();
          },
          (error) => {
            this.toastr.error(
              error.error.errorMessage !== undefined
                ? error.error.errorMessage
                : 'Role Update failed',
              'Error!'
            );
            this.ngxLoaderService.stop();
          }
        );
      }
    }
  }

  onRoleAssginedSubmit(): void {
    this.ngxLoaderService.start();
    const model = new RolePermissionModel();
    const createRolePermissionForm = this.rolePermissionForm.value;
    model.roleId = createRolePermissionForm.roleId;
    model.menuIds = createRolePermissionForm.menuIds.map((x) => x.id);

    if (!this.isEdit) {
      this.roleService.addPermissionPermission(model).subscribe(
        (res) => {
          this.submitted = true;
          this.toastr.success('Role Permision Created Successfully.', 'Success!');
          this.modalService.dismissAll();
          this.ngxLoaderService.stop();
        },
        (error) => {
          console.log(error);
          this.isSubmitting = false;
          this.modalService.dismissAll();
          this.toastr.error(error?.error?.errorMessage, 'Error!');
          this.ngxLoaderService.stop();
        }
      );
    }
    else{
      this.roleService.editRolePermission(model).subscribe(
        (res) => {
          this.submitted = true;
          this.toastr.success('Role Permision Updated Successfully.', 'Success!');
          this.modalService.dismissAll();
          this.ngxLoaderService.stop();
        },
        (error) => {
          console.log(error);
          this.isSubmitting = false;
          this.modalService.dismissAll();
          this.toastr.error(error.error.errorMessage, 'Error!');
          this.ngxLoaderService.stop();
        }
      );
    }
  }

  getDismissReason(reason: any): string {
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
    this.isEdit = true;
    this.selectrole = this.role;
    this.EventValue = 'Update';
    this.roleForm.patchValue({
      roleName: role.roleName,
      roleId: role.roleId,
    });
    this.openModal(content);
  }

  EditPermission(content: any, role: RoleModel) {
    this.disableRoleDdl = true;
    this.isEdit = true;
    this.EventValue = 'Update';
    this.rolePermissionForm.patchValue({
      roleName: role.roleName,
      roleId: role.roleId,
    });
    this.roleService.getRolePermission(role.roleId).subscribe(
      (result) => {
        console.table(result.menuIds);
        this.checkedMenuList = this.menuList.filter((item) =>
          result.menuIds.includes(item.id)
        );
        console.log(this.checkedMenuList);
       
      },
      (error) => {
        console.log(error);
        this.ngxLoaderService.stop();
      }
    );
    this.openModal(content);
  }

  openModal(content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        backdropClass: 'static',
        windowClass: 'modal-cfo',
        backdrop: false,
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
