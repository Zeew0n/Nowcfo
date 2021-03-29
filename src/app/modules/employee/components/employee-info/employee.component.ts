import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  NgForm,
} from '@angular/forms';
import {
  NgbModal,
  ModalDismissReasons,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, ChildrenOutletContexts, Router } from '@angular/router';
import { RoleModel } from 'src/app/models/role.model';
import { EmployeeModel } from 'src/app/models/employee.model';
import { DesignationModel } from 'src/app/models/designation.model';

import { OrganizationModel } from 'src/app/models/organization.model';
import { DownlineTreeviewItem, TreeviewConfig, TreeviewItem, TreeviewHelper } from 'ngx-treeview';
import csc from 'country-state-city';

import { EmployeeUpdateModel } from 'src/app/models/EmployeeUpdateModel';
import { analyzeNgModules } from '@angular/compiler';
import { Observable, of } from 'rxjs';


// KendoTreeview
import { CheckableSettings, CheckedState, TreeItemLookup } from '@progress/kendo-angular-treeview';
import { KendoNavModel } from 'src/app/models/KendoNavModel';
import { EmployeeService } from '../../services/employee.service';
import { NavigationService } from 'src/app/modules/navigation/services/navigation.service';
import AuthenticationService from 'src/app/modules/user-account/services/authentication.service';

@Component({
  selector: 'app-employee-list',
  styleUrls: ['employee.component.scss'],
  templateUrl: './employee.component.html',
})
export class EmployeeComponent implements OnInit {

  employee: EmployeeModel = new EmployeeModel();
  employees: EmployeeModel[];
  designations: DesignationModel[];
  organizations: OrganizationModel[];
  supervisors: EmployeeModel[];
  dropdownEmailAttachmentSettings: any = {};

  // Added for dropdown
  title = 'dropdowmcheckbox';
  disabled = false;
  showFilter = false;
  limitSelection = false;
  cities: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};
  emailAttachmentList: Array<any> = [];
  employeeId = '';
  isSubmitting: boolean; // Form submission variable
  closeResult = ''; // close result for modal
  submitted = false;
  userId = '';
  isEdit = false;
  stateList: Array<any>;
  simpleItems = [];
  isUpdate = false;
  selectemployee;
  selectedEmployeeId: string;
  selectedIds = [];
  showTree = false;

  // for treeview
  values: number[];
  updatevalues: number[];
  items: TreeviewItem[] = [];
  updateitems: TreeviewItem[] = [];
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400,
  });

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private employeeService: EmployeeService,
    private navigationService: NavigationService,
    private authService: AuthenticationService,
    private route: ActivatedRoute
  ) {

  }


  /* Form Declarations */
  employeeForm: FormGroup;
  EventValue: any = 'Save';
  isActive: boolean;
  hasUser = false;
  hasAdmin = false;
  hasSuperAdmin = false;

  employeeName = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  phone = new FormControl('', [Validators.required]);
  address = new FormControl('', [Validators.required]);
  city = new FormControl('', [Validators.required]);
  zipCode = new FormControl('', [Validators.required]);
  state = new FormControl('', [Validators.required]);
  organizationId = new FormControl(true, [Validators.required]);
  designationId = new FormControl('', [Validators.required]);
  superVisorId = new FormControl('');
  isSupervisor = new FormControl('');
  payTypeCheck = new FormControl(false);
  pay = new FormControl(true, [Validators.required]);
  overTimeRate = new FormControl('', [Validators.required]);
  orgPermissionId = new FormControl();


  ngOnInit() {
    this.getEmployees();
    this.getOrganizations();
    this.getDesignations();
    this.initializeemployeeForm();
    this.getOrganizatioNavigation();
    this.getSuperVisors();

    this.dropdownEmailAttachmentSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }


  getOrganizatioNavigation() {
    this.navigationService.getOrganizationNavigation().subscribe(
      (res: TreeviewItem[]) => {
        this.items.length = 0;
        res.forEach((data) => {
          const item = new TreeviewItem({
            text: data.text,
            value: data.value,
            collapsed: true,
            children: data.children,
          });
          console.log(item);
          this.items.push(item);

        });
      },
      (error) => console.error(error)
    );
  }

  onSelect(event){
    console.log(event);
  }

  onFilterChange(value: string): void {
    console.log('filter:', value);
  }

  checkIsSupervisor(event) {
    console.log('test');
  }

  get f() {
    return this.employeeForm.controls;
  }

  getEmployees() {
    this.employeeService.getAllEmployees().subscribe(
      (result) => {
        this.employees = result;
      },
      (error) => console.error
    );
  }

  getDesignations() {
    this.employeeService.getAllDesignations().subscribe(
      (result) => {
        this.designations = result;
      },
      (error) => console.error
    );
  }

  getSuperVisors() {
    this.employeeService.getAllSuperVisors().subscribe(
      (result) => {
        this.supervisors = result;
      },
      (error) => console.error
    );
  }

  getOrganizations() {
    this.employeeService.GetAllOrganizations().subscribe(
      (result) => {

        this.organizations = result;
        const count = result.length;
        if (count > 0) {
          this.emailAttachmentList = [];
          for (let i = 0; i < count; i++) {
            const element = result[i];
            this.emailAttachmentList.push({ item_id: element.organizationId, item_text: element.organizationName });
          }
        }
      },
      (error) => console.error
    );
  }

  initializeemployeeForm() {
    this.stateList = csc.getStatesOfCountry('US');
    this.employeeForm = new FormGroup({
      employeeName: this.employeeName,
      email: this.email,
      phone: this.phone,
      address: this.address,
      city: this.city,
      zipCode: this.zipCode,
      state: this.state,
      organizationId: this.organizationId,
      designationId: this.designationId,
      isSupervisor: this.isSupervisor,
      superVisorId: this.superVisorId,
      payTypeCheck: this.payTypeCheck,
      pay: this.pay,
      overTimeRate: this.overTimeRate,
      orgPermissionId: this.orgPermissionId
    });
  }


  // Edit
  EditData(content, id: string) {
    this.selectedEmployeeId = id;
    this.resetFrom();
    this.employeeId = id;

    this.isUpdate = true;
    this.isEdit = true;
    this.getEmployeeById(id, content);
  }

  private displayFormData(data: EmployeeUpdateModel, id: any) {
    this.employeeForm.patchValue({
      employeeName: data.employeeName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      zipCode: data.zipCode,
      state: data.state,
      organizationId: data.organizationId,
      designationId: data.designationId,
      isSupervisor: data.isSupervisor,
      superVisorId: data.superVisorId,
      payType: data.payType,
      payTypeCheck: data.payType == 'Salary' ? true : false,
      pay: data.pay,
      overTimeRate: data.overTimeRate
      // orgPermissionId:data.employeepermissions
    });
  }

  getEmployeeById(id: string, content) {
    this.employeeService.getEmployeeById(id).subscribe(
      (res: EmployeeUpdateModel) => {
        if (res) {
        this.isEdit = true;
        }
        this.EventValue = 'Update';
        this.displayFormData(res, id);
        this.openModal(content);
      },
      error => {
        this.toastr.error(error.error.errorMessage !== undefined ?
          error.error.errorMessage : 'Employee Create failed', 'Error!');
      });
  }

  openDeleteModal(content, id) {
    this.EventValue = 'Delete';
    this.selectedEmployeeId = id;
    this.openModal(content);
  }

  Delete() {
    this.employeeService.DeleteEmployee(this.selectedEmployeeId).subscribe(
      (result) => {
        if (result == null) {
          this.modalService.dismissAll();
          this.toastr.success('Employee delete successfully.', 'success!');
          this.getEmployees();
        } else {
          this.toastr.success('something went wrong.', 'error!');
        }
      },
      (error) => {
        console.log(error.errorMessage);
        this.toastr.error('Cannot delete employee', 'error!');
      }
    );
  }


  open(content) {
    this.isUpdate = false;
    this.resetFrom();
    this.isEdit = false;
    this.userId = '';
    this.employee == null;
    this.openModal(content);
  }

  /**
   * Triggers on state option change
   * @param event
   */
  onStateChange(event) {
    if (event !== undefined) {
      this.employeeForm.controls.state.setValue(event.name);
    }
  }

  onSubmit() {

    const createForm = this.employeeForm.value;
    console.log(createForm);

    if (!this.isUpdate) {
      if (this.employeeForm.valid) {
        const model = {
          employeeName: createForm.employeeName,
          email: createForm.email,
          phone: createForm.phone,
          address: createForm.address,
          city: createForm.city,
          zipCode: createForm.zipCode,
          state: createForm.state,
          organizationId: createForm.organizationId,
          designationId: createForm.designationId,
          isSupervisor: createForm.isSupervisor,
          superVisorId: createForm.superVisorId,
          payTypeCheck: createForm.payTypeCheck ? true : false,
          pay: createForm.pay,
          overTimeRate: createForm.overTimeRate,
          payType: '',
          employeepermissions: this.values
        };

        if (model.payTypeCheck) {
          model.payType = 'Salary';
        }
        else {
          model.payType = 'Hourly';
        }


        this.employeeService.CreateEmployee(model).subscribe(
          (res) => {
            this.submitted = true;
            this.toastr.success('Employee Added Successfully.', 'Success!');
            this.modalService.dismissAll();
            this.getEmployees();
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
      if (this.employeeForm.valid) {


        const model = {
          employeeName: createForm.employeeName,
          email: createForm.email,
          phone: createForm.phone,
          address: createForm.address,
          city: createForm.city,
          zipCode: createForm.zipCode,
          state: createForm.state,
          organizationId: createForm.organizationId,
          designationId: createForm.designationId,
          isSupervisor: createForm.isSupervisor,
          superVisorId: createForm.superVisorId,
          payTypeCheck: createForm.payTypeCheck ? true : false,
          pay: createForm.pay,
          overTimeRate: createForm.overTimeRate,
          payType: '',
          employeepermissions: this.updatevalues,
        };

        if (model.payTypeCheck) {
          model.payType = 'Salary';
        }
        else {
          model.payType = 'Hourly';
        }

        this.employeeId = this.selectedEmployeeId;
        this.employeeService.updateEmployee(this.employeeId, model).subscribe(
          (res) => {
            this.toastr.success('Employee Updated Successfully.', 'Success!');
            this.modalService.dismissAll();
            this.getEmployees();
          },
          (error) => {
            this.toastr.error(
              error.error.errorMessage !== undefined
                ? error.error.errorMessage
                : 'Employee Update failed',
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
    this.employeeForm.reset();
    this.EventValue = 'Save';
    this.submitted = false;
    this.employee == null;
  }






  private openModal(content: any) {
    this.showTree = true;
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

  onIdFromChild(event){
    this.selectedIds.push(event);
  }

}



