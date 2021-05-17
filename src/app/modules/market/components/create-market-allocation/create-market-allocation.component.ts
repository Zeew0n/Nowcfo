import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
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
import { AllocationTypeModel } from 'src/app/models/Market/allocation.model';
import { CogsTypeModel } from 'src/app/models/Market/cogs.model';
import { OtherTypeModel } from 'src/app/models/Market/other.model';
import { MarketService } from '../../services/market.service';
import { MarketAllocationModel } from 'src/app/models/Market/market-allocation.model';
import { MarketModel } from 'src/app/models/Market/market.model';
@Component({
  selector: 'app-create-market-allocation',
  templateUrl: './create-market-allocation.component.html',
  styleUrls: ['./create-market-allocation.component.scss']
})

export class CreateMarketAllocationComponent implements OnInit {

  model: NgbDateStruct;
  role: RoleModel = new RoleModel();
  roles: RoleModel[];

  markets: MarketModel[];
  allocationTypes:AllocationTypeModel[];
  cogsTypes:CogsTypeModel[];
  otherTypes:OtherTypeModel[];

  market:MarketMasterModel;
  marketAllocations: MarketAllocationModel[];
  menuList: MenuModel[];
  checkedMenuList: MenuModel[] = [];
  dropdownPermissionSettings;
  rolePermissionForm: FormGroup;

  closeResult = ''; // close result for modal


  isEdit = false;
  disableRoleDdl = false;
  selectrole;
  selectedRole: number;

  parentOrganizationId = '';

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private roleService: RoleService,
    private ngxLoaderService: NgxUiLoaderService,
    private location: Location,
    private _route: ActivatedRoute,
    private createMarketSerivce: CreateMarketService,
    private marketService: MarketService
  ) {}

  /* Form Declarations */
  marketMasterForm: FormGroup;
  allocationtList: FormArray;
  get allocationFormGroup() {
    return this.marketMasterForm.get('allocations') as FormArray;
  }
   // quantities() : FormArray {
  //   return this.marketMasterForm.get("allocations") as FormArray
  // }

  roleForm: FormGroup;
  EventValue: any = 'Save';

  roleId = new FormControl('');
  roleName = new FormControl('', [Validators.required]);

  ngOnInit() {
    this._route.queryParamMap.subscribe((queryParams) => {
      if (queryParams.has('id')) {
        this.parentOrganizationId = queryParams.get('id');
      } 
    });

    this.initializeMarketAllocationModelForm();
    // set contactlist to the form control containing contacts
    this.allocationtList = this.marketMasterForm.get('allocations') as FormArray;

    this.getAllocationTypes();
    this.getCogsTypes();
    this.getOtherTypes();
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

  getAllocationTypes() {
    this.createMarketSerivce.getAllAllocationTypes().subscribe(
      (data)=>{
        this.allocationTypes = data;
      },
      (err)=>{
        console.log(err);
      }
    )
  }

  getCogsTypes() {
    this.createMarketSerivce.getAllCogsType().subscribe(
      (data)=>{
        this.cogsTypes = data;
      },
      (err)=>{
        console.log(err);
      }
    )
  }

  getOtherTypes() {
    this.createMarketSerivce.getAllOtherTypes().subscribe(
      (data)=>{
        this.otherTypes = data;
      },
      (err)=>{
        console.log(err);
      }
    )
  }

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
      allocationTypeId:[null, [Validators.required]],
      allocations:  this.fb.array([this.createAllocation()])
    });
    this.createMarketSerivce.getAllMarketsByOrgId(1)
    .subscribe(
      (data) => {
        
        this.markets  = Object.assign([], data);

        console.log(this.markets);
        console.table(this.markets);

      },
      (error) => {
        this.toastr.error('err', 'error!');
      }
    )
  }
  hidePlusIcon=false;
  hideMinusIcon=true;
  addAllocation() {
    this.hidePlusIcon = true;
    this.hideMinusIcon = false;
    this.allocationtList.push(this.createAllocation());
  }
  
  removeAllocation(index) {
    this.allocationtList.removeAt(index);
  }
  

  // quantities() : FormArray {
  //   return this.marketMasterForm.get("allocations") as FormArray
  // }

  createAllocation(): FormGroup {
    return this.fb.group({
        marketId: [null, [Validators.required]],
        revenue:['', [Validators.required]],
        cogs: ['', [Validators.required]],
        cogsTypeId: [null, [Validators.required]],
        se: ['', [Validators.required]],
        ee: ['', [Validators.required]],
        ga: ['', [Validators.required]],
        other: ['', [Validators.required]],
        otherTypeId:[null, [Validators.required]],
    })
  }


  // get the formgroup under contacts form array
  getAllocationsFormGroup(index): FormGroup {
    // this.contactList = this.form.get('contacts') as FormArray;
    const formGroup = this.allocationtList.controls[index] as FormGroup;
    return formGroup;
  }

  // triggered to change validation of value field type
  changedFieldType(index) {
    let validators = null;

    if (this.getAllocationsFormGroup(index).controls['type'].value === 'email') {
      validators = Validators.compose([Validators.required, Validators.email]);
    } else {
      validators = Validators.compose([
        Validators.required,
        Validators.pattern(new RegExp('^\\+[0-9]?()[0-9](\\d[0-9]{9})$')) // pattern for validating international phone number
      ]);
    }

    this.getAllocationsFormGroup(index).controls['value'].setValidators(
      validators
    );

    this.getAllocationsFormGroup(index).controls['value'].updateValueAndValidity();
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

  submit() {
    this.ngxLoaderService.start();
    const createForm = this.marketMasterForm.value;
    console.log(createForm);
    if (!this.isEdit) {
      if (true) {
        const model = new MarketMasterModel();
        model.organizationId = createForm.organizationId;
        model.payPeriod = createForm.payPeriod;
        model.allocationTypeId = createForm.allocationTypeId;
        model.marketAllocations = createForm.allocations;
        this.marketService.createMarketMaster(model).subscribe(
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