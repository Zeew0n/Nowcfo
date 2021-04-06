import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Data } from '@angular/router';
import { EmployeeModel } from 'src/app/models/employee.model';
import { DesignationModel } from 'src/app/models/designation.model';
import { OrganizationModel } from 'src/app/models/organization.model';
import csc from 'country-state-city';
import { EmployeeService } from '../../services/employee.service';
import {
  PaginatedResult,
  Pagination,
} from 'src/app/models/Pagination/Pagination';
import { OrganizationService } from 'src/app/modules/organization/services/organization.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit {
  employee: EmployeeModel = new EmployeeModel();
  employees: EmployeeModel[];
  designations: DesignationModel[];
  organizations: OrganizationModel[];
  supervisors: EmployeeModel[];
  disabled = false;
  cities: any = [];
  employeeId = '';
  pagination: Pagination;
  searchTypes: any = [];
  employeeTypes: any=[];
  closeResult = ''; // close result for modal
  submitted = false;
  isEdit = false;
  stateList: Array<any>;
  selectemployee;
  selectedEmployeeId: string;
  values: number[];
  @Output() messageEvent = new EventEmitter<string>();

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private employeeService: EmployeeService,
    private organizationService: OrganizationService,
    private route: ActivatedRoute
  ) {}

  countries: Object[] = [];

  field = {
    dataSource: this.countries,
    id: 'id',
    parentID: 'pid',
    text: 'name',
    hasChildren: 'hasChild',
    isChecked: 'isChecked',
    expanded: 'expanded',
  };

  showCheckBox = true;

  employeeForm: FormGroup;
  searchForm: FormGroup;
  EventValue: any = 'Save';
  //isActive: boolean;

  searchTypeId = new FormControl(null, [Validators.required]);
  searchValue = new FormControl('', [Validators.required]);

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
  employeeType = new FormControl(null, [Validators.required]);
  overTimeRate = new FormControl('', [Validators.required]);

  ngOnInit() {
    this.getDesignations();
    this.getOrganizations();
    this.initializeemployeeForm();
    this.route.data.subscribe((data: Data) => {
      this.employees = data.employees.result;
      this.pagination = data.employees.pagination;
    });

    this.searchTypes = [
      { id: 1, name: 'Name' },
      { id: 2, name: 'Email' },
    ];

    this.employeeTypes = [
      { id: 1, name: 'Full-Time' },
      { id: 2, name: 'Part-Time' },
      { id: 3, name: 'Hybrid' },
      { id: 4, name: 'Vendor' },
    ];



    this.initializeSearchForm();
    this.getSuperVisors();
    this.getSyncHierarchy();
  }

  nodeChecked(checkedValues): void {
    this.values = checkedValues;
  }

  getEmployees() {
    this.employeeService
      .getPaginatedEmployees(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.searchTypeId.value,
        this.searchValue.value
      )
      .subscribe(
        (res: PaginatedResult<EmployeeModel[]>) => {
          this.employees = res.result;
          this.pagination = res.pagination;
        },
        (error) => {
          this.toastr.error(error);
        }
      );
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.getEmployees();
  }

  getSyncHierarchy() {
    this.employeeService.getSyncTreeView().subscribe(
      (result) => {
        result.forEach((element) => {
          this.countries.push(element);
        });
      },
      () => console.error
    );
  }

  getEmployeePermissionNavigation(employeeId) {
    this.countries = [];
    this.employeeService
      .getEmployeePermissionNavigationById(employeeId)
      .subscribe(
        (result) => {
          result.forEach((element) => {
            this.countries.push(element);
            this.field.dataSource = this.countries;
          });
        },
        () => console.error
      );
  }

  getDesignations() {
    this.employeeService.getAllDesignations().subscribe(
      (result) => {
        this.designations = result;
      },
      () => console.error
    );
  }

  getOrganizations() {
    this.organizationService.getAllOrganizations().subscribe(
      (result) => {
        this.organizations = result;
      },
      () => console.error
    );
  }

  getSuperVisors() {
    this.employeeService.getAllSuperVisors().subscribe(
      (result) => {
        this.supervisors = result;
      },
      () => console.error
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
      employeeType: this.employeeType,
      overTimeRate: this.overTimeRate,
    });
  }

  initializeSearchForm() {
    this.searchForm = new FormGroup({
      searchTypeId: this.searchTypeId,
      searchValue: this.searchValue,
    });
  }

  EditData(content, id: string) {
    this.values = null;
    this.isEdit = true;
    this.getEmployeePermissionNavigation(id);
    this.selectedEmployeeId = id;
    this.employeeService.previewdata.emit(this.selectedEmployeeId);
    this.resetFrom();
    this.employeeId = id;
    this.getEmployeeById(id, content);
  }

  private displayFormData(data: EmployeeModel, id: any) {
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
      overTimeRate: data.overTimeRate,
      employeeType: data.employeeType,
    });
  }

  getEmployeeById(id: string, content) {
    this.employeeService.getEmployeeById(id).subscribe(
      (res: EmployeeModel) => {
        this.isEdit = true;
        this.EventValue = 'Update';
        this.displayFormData(res, id);
        this.openModal(content);
      },
      (error) => {
        this.toastr.error(
          error.error.errorMessage !== undefined
            ? error.error.errorMessage
            : 'Employee Create failed',
          'Error!'
        );
      }
    );
  }

  openDeleteModal(content, id) {
    this.EventValue = 'Delete';
    this.selectedEmployeeId = id;
    this.openModal(content);
  }

  Delete() {
    this.employeeService.deleteEmployee(this.selectedEmployeeId).subscribe(
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
    this.resetFrom();
    this.isEdit = false;
    this.openModal(content);
  }

  onStateChange(event) {
    if (event !== undefined) {
      this.employeeForm.controls.state.setValue(event.name);
    }
  }

  onSearch() {
    this.getEmployees();
  }

  onSubmit() {
    const createForm = this.employeeForm.value;
    if (!this.isEdit) {
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
          employeeType: createForm.employeeType,
          payType: '',
          employeepermissions: this.values,
        };

        if (model.payTypeCheck) {
          model.payType = 'Salary';
        } else {
          model.payType = 'Hourly';
        }

        this.employeeService.createEmployee(model).subscribe(
          () => {
            this.submitted = true;
            this.toastr.success('Employee Added Successfully.', 'Success!');
            this.modalService.dismissAll();
            this.getEmployees();
          },
          (error) => {
            console.log(error);
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
          employeeType:createForm.employeeType,
          payType: '',
          employeepermissions: this.values,
        };

        if (model.payTypeCheck) {
          model.payType = 'Salary';
        } else {
          model.payType = 'Hourly';
        }

        this.employeeId = this.selectedEmployeeId;

        this.employeeService.updateEmployee(this.employeeId, model).subscribe(
          () => {
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
    this.employeeForm.reset();
    this.EventValue = 'Save';
    this.submitted = false;
  }

  resetSearch() {
    this.searchForm.reset();
    this.ngOnInit();
  }

  openModal(content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'modal-cfo',
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
