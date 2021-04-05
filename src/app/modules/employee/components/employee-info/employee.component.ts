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
import {
  ActivatedRoute,
  ChildrenOutletContexts,
  Data,
  Router,
} from '@angular/router';
import { EmployeeModel } from 'src/app/models/employee.model';
import { DesignationModel } from 'src/app/models/designation.model';

import { OrganizationModel } from 'src/app/models/organization.model';

import csc from 'country-state-city';
import { analyzeNgModules } from '@angular/compiler';
import { Observable, of } from 'rxjs';
import { EmployeeService } from '../../services/employee.service';
import { NavigationService } from 'src/app/modules/navigation/services/navigation.service';
import AuthenticationService from 'src/app/modules/user-account/services/authentication.service';
import {
  PaginatedResult,
  Pagination,
} from 'src/app/models/Pagination/Pagination';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-employee-list',
  styleUrls: ['employee.component.scss'],
  templateUrl: './employee.component.html',
})
export class EmployeeComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private ngxLoaderService: NgxUiLoaderService,
    private toastr: ToastrService,
    private employeeService: EmployeeService,
    private navigationService: NavigationService,
    private authService: AuthenticationService,
    private route: ActivatedRoute
  ) {}

  get f() {
    return this.employeeForm.controls;
  }

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
  closeResult = '';
  userId = '';
  isEdit = false;
  stateList: Array<any>;
  selectemployee;
  selectedEmployeeId: string;
  values: number[];

  countries: Object[] = [];
  public field = {
    dataSource: this.countries,
    id: 'id',
    parentID: 'pid',
    text: 'name',
    hasChildren: 'hasChild',
    isChecked: 'isChecked',
  };
  emppermissions: string[] = [];


  public nodeChecked(checkedValues): void {
    this.values = checkedValues;
    }

  public showCheckBox = true;

  /* Form Declarations */
  searchForm: FormGroup;
  employeeForm: FormGroup;
  EventValue: any = 'Save';
  isActive: boolean;

  employeeName = new FormControl('', [Validators.required]);
  searchTypeId = new FormControl(null, [Validators.required]);
  searchValue = new FormControl('', [Validators.required]);
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

  ngOnInit() {
    this.getOrganizations();
    this.getDesignations();
    this.initializeemployeeForm();
    this.route.data.subscribe((data: Data) => {
      this.employees = data.employees.result;
      console.log(this.employees);
      this.pagination = data.employees.pagination;
    });

    this.searchTypes = [
      { id: 1, name: 'Name' },
      { id: 2, name: 'Email' },
    ];

    this.initializeSearchForm();
    this.getSuperVisors();
    this.getSyncHierarchy();
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
    this.employeeService.GetSyncTreeView().subscribe(
      (result) => {
        result.forEach((element) => {
          this.countries.push(element);
        });
      },
      (error) => console.error
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
        (error) => console.error
      );
  }

  getCheckedPermission(employeeId) {
    this.employeeService.getCheckedPermission(employeeId).subscribe(
      (result) => {
        result.forEach((element) => {
          this.emppermissions.push(element.orgId);
          console.log(this.emppermissions);
        });
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

  getOrganizations() {
    this.employeeService.GetAllOrganizations().subscribe(
      (result) => {
        this.organizations = result;
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
    });
  }

  initializeSearchForm() {
    this.searchForm = new FormGroup({
      searchTypeId: this.searchTypeId,
      searchValue: this.searchValue,
    });
  }

  //Edit
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

  displayFormData(data: EmployeeModel, id: any) {
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
    });
  }

  getEmployeeById(id: string, content) {
    this.employeeService.getEmployeeById(id).subscribe(
      (res: EmployeeModel) => {
        if (res) this.isEdit = true;
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
    this.resetFrom();
    this.isEdit = false;
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
          payType: '',
          employeepermissions: this.values,
        };

        if (model.payTypeCheck) {
          model.payType = 'Salary';
        } else {
          model.payType = 'Hourly';
        }

        this.employeeService.CreateEmployee(model).subscribe(
          (res) => {
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

  // initializeemployeeForm() {
  //   this.stateList = csc.getStatesOfCountry('US');
  //   this.employeeForm = new FormGroup({
  //     employeeName: this.employeeName,
  //     email: this.email,
  //     phone: this.phone,
  //     address: this.address,
  //     city: this.city,
  //     zipCode: this.zipCode,
  //     state: this.state,
  //     organizationId: this.organizationId,
  //     designationId: this.designationId,
  //     isSupervisor: this.isSupervisor,
  //     superVisorId: this.superVisorId,
  //     payTypeCheck: this.payTypeCheck,
  //     pay: this.pay,
  //     overTimeRate: this.overTimeRate,
  //     orgPermissionId: this.orgPermissionId,
  //   });
  // }

  // initializeSearchForm() {
  //   this.searchForm = new FormGroup({
  //     searchTypeId: this.searchTypeId,
  //     searchValue: this.searchValue,
  //   });
  // }

  // // Edit
  // EditData(content, id: string) {
  //   this.selectedEmployeeId = id;
  //   this.resetFrom();
  //   this.employeeId = id;

  //   this.isUpdate = true;
  //   this.isEdit = true;
  //   this.getEmployeeById(id, content);
  // }

  // private displayFormData(data: EmployeeUpdateModel, id: any) {
  //   this.employeeForm.patchValue({
  //     employeeName: data.employeeName,
  //     email: data.email,
  //     phone: data.phone,
  //     address: data.address,
  //     city: data.city,
  //     zipCode: data.zipCode,
  //     state: data.state,
  //     organizationId: data.organizationId,
  //     designationId: data.designationId,
  //     isSupervisor: data.isSupervisor,
  //     superVisorId: data.superVisorId,
  //     payType: data.payType,
  //     payTypeCheck: data.payType == 'Salary' ? true : false,
  //     pay: data.pay,
  //     overTimeRate: data.overTimeRate,
  //   });
  // }

  // getEmployeeById(id: string, content) {
  //   this.employeeService.getEmployeeById(id).subscribe(
  //     (res: EmployeeUpdateModel) => {
  //       if (res) {
  //         this.isEdit = true;
  //       }
  //       this.EventValue = 'Update';
  //       this.displayFormData(res, id);
  //       this.openModal(content);
  //     },
  //     (error) => {
  //       this.toastr.error(
  //         error.error.errorMessage !== undefined
  //           ? error.error.errorMessage
  //           : 'Employee Create failed',
  //         'Error!'
  //       );
  //     }
  //   );
  // }

  // openDeleteModal(content, id) {
  //   this.EventValue = 'Delete';
  //   this.selectedEmployeeId = id;
  //   this.openModal(content);
  // }

  // Delete() {
  //   this.ngxLoaderService.start();
  //   this.employeeService.DeleteEmployee(this.selectedEmployeeId).subscribe(
  //     (result) => {
  //       if (result == null) {
  //         this.modalService.dismissAll();
  //         this.toastr.success('Employee delete successfully.', 'success!');
  //         this.getEmployees();
  //         this.ngxLoaderService.stop();
  //       } else {
  //         this.toastr.success('something went wrong.', 'error!');
  //       }
  //     },
  //     (error) => {
  //       console.log(error.errorMessage);
  //       this.toastr.error('Cannot delete employee', 'error!');
  //       this.ngxLoaderService.stop();
  //     }
  //   );
  // }

  // open(content) {
  //   this.isUpdate = false;
  //   this.resetFrom();
  //   this.isEdit = false;
  //   this.userId = '';
  //   this.employee == null;
  //   this.openModal(content);
  // }

  // /**
  //  * Triggers on state option change
  //  * @param event
  //  */
  // onStateChange(event) {
  //   if (event !== undefined) {
  //     this.employeeForm.controls.state.setValue(event.name);
  //   }
  // }

  // onSearch() {
  //   this.getEmployees();
  // }

  // onSubmit() {
  //   this.ngxLoaderService.start();
  //   const createForm = this.employeeForm.value;
  //   console.log(createForm);

  //   if (!this.isUpdate) {
  //     if (this.employeeForm.valid) {
  //       const model = {
  //         employeeName: createForm.employeeName,
  //         email: createForm.email,
  //         phone: createForm.phone,
  //         address: createForm.address,
  //         city: createForm.city,
  //         zipCode: createForm.zipCode,
  //         state: createForm.state,
  //         organizationId: createForm.organizationId,
  //         designationId: createForm.designationId,
  //         isSupervisor: createForm.isSupervisor,
  //         superVisorId: createForm.superVisorId,
  //         payTypeCheck: createForm.payTypeCheck ? true : false,
  //         pay: createForm.pay,
  //         overTimeRate: createForm.overTimeRate,
  //         payType: '',
  //         employeepermissions: this.values,
  //       };

  //       if (model.payTypeCheck) {
  //         model.payType = 'Salary';
  //       } else {
  //         model.payType = 'Hourly';
  //       }

  //       this.employeeService.CreateEmployee(model).subscribe(
  //         (res) => {
  //           this.toastr.success('Employee Added Successfully.', 'Success!');
  //           this.modalService.dismissAll();
  //           this.getEmployees();
  //           this.ngxLoaderService.stop();
  //         },

  //         (error) => {
  //           console.log(error);
  //           this.modalService.dismissAll();
  //           this.toastr.error(error.error.errorMessage, 'Error!');
  //           this.ngxLoaderService.stop();
  //         }
  //       );
  //     }
  //   } else {
  //     if (this.employeeForm.valid) {
  //       const model = {
  //         employeeName: createForm.employeeName,
  //         email: createForm.email,
  //         phone: createForm.phone,
  //         address: createForm.address,
  //         city: createForm.city,
  //         zipCode: createForm.zipCode,
  //         state: createForm.state,
  //         organizationId: createForm.organizationId,
  //         designationId: createForm.designationId,
  //         isSupervisor: createForm.isSupervisor,
  //         superVisorId: createForm.superVisorId,
  //         payTypeCheck: createForm.payTypeCheck ? true : false,
  //         pay: createForm.pay,
  //         overTimeRate: createForm.overTimeRate,
  //         payType: '',
  //         employeepermissions: this.updatevalues,
  //       };

  //       if (model.payTypeCheck) {
  //         model.payType = 'Salary';
  //       } else {
  //         model.payType = 'Hourly';
  //       }

  //       this.employeeId = this.selectedEmployeeId;
  //       this.employeeService.updateEmployee(this.employeeId, model).subscribe(
  //         (res) => {
  //           this.toastr.success('Employee Updated Successfully.', 'Success!');
  //           this.modalService.dismissAll();
  //           this.getEmployees();
  //           this.ngxLoaderService.stop();
  //         },
  //         (error) => {
  //           this.toastr.error(
  //             error.error.errorMessage !== undefined
  //               ? error.error.errorMessage
  //               : 'Employee Update failed',
  //             'Error!'
  //           );
  //           this.ngxLoaderService.stop();
  //         }
  //       );
  //     }
  //   }
  // }

  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return `with: ${reason}`;
  //   }
  // }

  // resetFrom() {
  //   this.employeeForm.reset();
  //   this.EventValue = 'Save';
  //   this.employee == null;
  // }

  // resetSearch() {
  //   this.searchForm.reset();
  // }

  // private openModal(content: any) {
  //   this.showTree = true;
  //   this.modalService
  //     .open(content, {
  //       ariaLabelledBy: 'modal-basic-title',
  //       backdropClass: 'static',
  //       windowClass: 'modal-cfo',
  //       backdrop: false,
  //     })
  //     .result.then(
  //       (result) => {
  //         this.closeResult = `Closed with: ${result}`;
  //       },
  //       (reason) => {
  //         this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //       }
  //     );
  // }

  // onIdFromChild(event) {
  //   this.selectedIds.push(event);
  // }
}
