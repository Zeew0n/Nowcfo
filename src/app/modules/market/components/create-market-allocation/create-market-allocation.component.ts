import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RoleModel } from 'src/app/models/role.model';
import { MenuModel } from 'src/app/models/menu.model';
import { RolePermissionModel } from 'src/app/models/role-permission';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {Location} from '@angular/common';
import { RoleService } from 'src/app/modules/user-account/services/userrole.service';
import { ActivatedRoute } from '@angular/router';
import { MarketMasterModel } from 'src/app/models/Market/market-master.model';
import { CreateMarketService } from '../../services/create-market.service';
@Component({
  selector: 'app-create-market-allocation',
  templateUrl: './create-market-allocation.component.html',
  styleUrls: ['./create-market-allocation.component.scss']
})

export class CreateMarketAllocationComponent implements OnInit {

  market:MarketMasterModel;
  role: RoleModel = new RoleModel();
  roles: RoleModel[];
  menuList: MenuModel[];
  checkedMenuList: MenuModel[] = [];
  dropdownPermissionSettings;
  rolePermissionForm: FormGroup;

  closeResult = ''; // close result for modal


  isEdit = false;
  disableRoleDdl = false;
  selectrole;
  selectedRole: number;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private roleService: RoleService,
    private ngxLoaderService: NgxUiLoaderService,
    private location: Location,
    private _route: ActivatedRoute,
    private _createMarketSerivce: CreateMarketService
  ) {}

  /* Form Declarations */
  marketMasterForm: FormGroup;
  roleForm: FormGroup;
  EventValue: any = 'Save';

  roleId = new FormControl('');
  roleName = new FormControl('', [Validators.required]);

  ngOnInit() {
    this._route.queryParamMap.subscribe((queryParams) => {
      if (queryParams.has('id')) {
        const id = queryParams.get('id');
      } 
    });
    this.initializeMarketAllocationModelForm();
    // this.getAllocationTypes();
    // this.getCogsTypes();
    // this.getOtherTypes();
    // const id = +this._route.snapshot.paramMap.get('id');

    this.getRoles();
    this.getMenusForPermission();
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

  backClicked() {
    this.location.back();
  }

  // getAllocationTypes(){
  //   this._createMarketSerivce.
  // }
  getRoles() {
    this.roleService.getAllRoles().subscribe(
      (result) => {
        this.roles = result;
       
      },
      (error) => console.error
    );
  }
  getMenusForPermission() {
    this.roleService.getParentMenusForPermission().subscribe(
      (result) => {
        this.menuList = result;
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
      roleId: new FormControl(null, [Validators.required]),
      menuIds: new FormControl(null, [Validators.required]),
    });
  }

 
  initializeMarketAllocationModelForm() {
    this.marketMasterForm = this.fb.group ({
      organizationId:[''],
      payperiod: ['', [Validators.required]],
      allocationTypeId:['', [Validators.required]],
      allocations:  this.fb.array([])
    });
    for (let i = 0; i < 1; i++) {
      (this.marketMasterForm.controls.allocations as FormArray).push(this.newAllocation());
    }
  }

  quantities() : FormArray {
    return this.marketMasterForm.get("allocations") as FormArray
  }

  newAllocation(): FormGroup {
    return this.fb.group({
        marketId: ['', [Validators.required]],
        cogs: ['', [Validators.required]],
        cogsTypeId: ['', [Validators.required]],
        se: ['', [Validators.required]],
        ee: ['', [Validators.required]],
        ga: ['', [Validators.required]],
        other: ['', [Validators.required]],
        otherTypeId:['', [Validators.required]],
    })
  }
  addAllocation() {
    (this.marketMasterForm.controls.allocations as FormArray).push(this.newAllocation());
    //this.quantities().push(this.newAllocation());
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

  delete() {
    this.ngxLoaderService.start();
    this.roleService.deleteRole(this.selectedRole).subscribe(
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
    const createForm = this.marketMasterForm.value;
    console.log(createForm);
    if (!this.isEdit) {
      if (this.marketMasterForm.valid) {
        const model = new MarketMasterModel();
        model.organizationId = createForm.organizationId;
        model.payPeriod = createForm.payPeriod;
        model.allocationTypeId = createForm.allocationTypeId;
        // model.marketAllocations = createForm.

        this.roleService.createRole(model).subscribe(
          (res) => {
            this.toastr.success('Role Added Successfully.', 'Success!');
            this.modalService.dismissAll();
            this.getRoles();
            this.ngxLoaderService.stop();
          },
          (error) => {
            console.log(error);
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

        this.roleService.updateRole(model).subscribe(
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
          this.toastr.success('Role Permision Created Successfully.', 'Success!');
          this.modalService.dismissAll();
          this.ngxLoaderService.stop();
        },
        (error) => {
          console.log(error);
          this.modalService.dismissAll();
          this.toastr.error(error?.error?.errorMessage, 'Error!');
          this.ngxLoaderService.stop();
        }
      );
    }
    else{
      this.roleService.editRolePermission(model).subscribe(
        (res) => {
          this.toastr.success('Role Permision Updated Successfully.', 'Success!');
          this.modalService.dismissAll();
          this.ngxLoaderService.stop();
        },
        (error) => {
          console.log(error);
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
    this.role = null;
  }

  editData(content, role: any) {
    this.isEdit = true;
    this.selectrole = this.role;
    this.EventValue = 'Update';
    this.roleForm.patchValue({
      roleName: role.roleName,
      roleId: role.roleId,
    });
    this.openModal(content);
  }

  editPermission(content: any, role: RoleModel) {
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