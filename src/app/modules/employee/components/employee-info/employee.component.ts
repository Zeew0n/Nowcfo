import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { NgbModal,NgbDateStruct, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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
import { EmployeeTypeModel } from 'src/app/models/employeetype.model';
import { EmployeeStatusTypeModel } from 'src/app/models/employeestatus.model';

const now = new Date();
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
  employeeTypes: EmployeeTypeModel[];
  employeeStatusTypes: EmployeeStatusTypeModel[];
  disabled = false;
  cities: any = [];
  employeeId = '';
  pagination: Pagination;
  searchTypes: any = [];
  closeResult = ''; // close result for modal
  submitted = false;
  isEdit = false;
  stateList: Array<any>;
  selectemployee;
  selectedEmployeeId: string;
  
    minDate: NgbDateStruct = {
      year: now.getFullYear()-17,
      month: now.getMonth(),
      day: now.getDate(),
    };
    minEndDate: NgbDateStruct = {
      year: this.minDate.year,
      month: this.minDate.month,
      day: this.minDate.day + 1,
    };



  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private employeeService: EmployeeService,
    private organizationService: OrganizationService,
    private route: ActivatedRoute
  ) {}


  employeeForm: FormGroup;
  searchForm: FormGroup;
  EventValue: any = 'Save';
  public statusDefaultValue = 1;

  searchTypeId = new FormControl(null, [Validators.required]);
  //For Adding Search
  searchOrg = new FormControl(null, [Validators.required]);
  searchStatus = new FormControl(null, [Validators.required]);

  searchValue = new FormControl('', [Validators.required]);

  employeeName = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  phone = new FormControl('', [Validators.required,Validators.pattern(/^[0-9]{10}$/)]);
  address = new FormControl('', [Validators.required]);
  city = new FormControl('', [Validators.required]);
  zipCode = new FormControl('', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]);
  state = new FormControl(null, [Validators.required]);
  organizationId = new FormControl(null, [Validators.required]);
  designationId = new FormControl(null, [Validators.required]);
  superVisorId = new FormControl(null);
  isSupervisor = new FormControl('');
  payTypeCheck = new FormControl(false);
  pay = new FormControl('', [Validators.required]);
  employeeTypeId = new FormControl(null, [Validators.required]);
  statusId= new FormControl(1, [Validators.required]);
  overTimeRate = new FormControl('', [Validators.required]);
  startDate= new FormControl('',[Validators.required]);
  terminationDate= new FormControl('');





  ngOnInit() {
    this.getDesignations();
    this.getOrganizations();

    this.route.data.subscribe((data: Data) => {
      this.employees = data.employees.result;
      this.pagination = data.employees.pagination;
    });
   
    this.searchTypes = [
      { id: 1, name: 'Name' },
      { id: 2, name: 'Email' },
    ];

    this.getEmployeeTypes();
    this.getEmployeeStatusTypes();
    this.initializeSearchForm();
    this.getSuperVisors();
    this.initializeemployeeForm();
    this.terminationValidation();
    this.statusDefaultValue = 1;


    
  }

 getEmployeesChanged(){
  this.getEmployees();

 }

  getEmployees() {
    this.employeeService
      .getPaginatedEmployees(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.searchOrg.value,
        this.searchStatus.value,
        this.searchTypeId.value,
        this.searchValue.value,
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


  startDateChanged() {
    this.minEndDate = {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate() + 1,
    };
    const startDate = this.employeeForm.value.startDate;
    this.minEndDate = {
      year: startDate.year,
      month: startDate.month,
      day: startDate.day + 1,
    };  
  }

  
  terminationValidation(){
  const statusValue = this.employeeForm.value.statusId;
  if(statusValue==1 || statusValue == 2 || statusValue==null){
    this.employeeForm.controls.terminationDate.setValidators(null);
    this.employeeForm.controls.terminationDate.setErrors(null);
  }else{
    this.employeeForm.controls.terminationDate.setValidators(Validators.required);
    this.employeeForm.controls.terminationDate.setErrors(this.employeeForm.value.terminationDate ? null : { required: true }
      );

  }
  }



  getDesignations() {
    this.employeeService.getAllDesignations().subscribe(
      (result) => {
        this.designations = result;
      },
      () => console.error
    );
  }



    /**
   * Set date
   */
     setDate(date) {
      if (date) {
        const parsedDate = date
          ? new Date('' + date.year + '/' + date.month + '/' + date.day)
          : null;
        return parsedDate.toLocaleDateString();
      }
    }
  
    /**
     * Get Parsed date
     */
    setNgbDate(date) {
      if (date) {
        const signDate: string = date.substring(0, 10);
        if (signDate.includes('-') || signDate.includes('/')) {
          let newDate = {} as any;
          let ngbDate = {} as any;
          if (signDate.includes('-')) {
            newDate = signDate.split('-');
            ngbDate = {
              year: Number(newDate[0]),
              month: Number(newDate[1]),
              day: Number(newDate[2]),
            };
          } else {
            newDate = signDate.split('/');
            ngbDate = {
              month: Number(newDate[0]),
              day: Number(newDate[1]),
              year: Number(newDate[2]),
            };
          }
          return ngbDate;
        }
      }
    }


  
  getEmployeeTypes() {
    this.employeeService.getAllEmployeeTypes().subscribe(
      (result) => {
        this.employeeTypes = result;
      },
      () => console.error
    );
  }


  getEmployeeStatusTypes() {
    this.employeeService.getAllEmployeeStatusTypes().subscribe(
      (result) => {
        this.employeeStatusTypes = result;
        this.statusDefaultValue=1;
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
      employeeTypeId: this.employeeTypeId,
      statusId: this.statusId,
      overTimeRate: this.overTimeRate,
      startDate: this.startDate,
      terminationDate:this.terminationDate,

    });
  }

  initializeSearchForm() {
    this.searchForm = new FormGroup({
      searchOrg: this.searchOrg,
      searchStatus:this.searchStatus,
      searchTypeId: this.searchTypeId,
      searchValue: this.searchValue

    });
  }

  EditData(content, id: string) {
    this.isEdit = true;
    this.selectedEmployeeId = id;
    this.resetFrom();
    this.employeeId = id;
    this.getEmployeeById(id, content);
  }

  private displayFormData(data: EmployeeModel, id: any) {

    this.minEndDate = {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate() + 1,
    };
    const startDate = this.setNgbDate(data.startDate);
    this.minEndDate = {
      year: startDate.year,
      month: startDate.month,
      day: startDate.day + 1,
    }; 

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
      employeeTypeId: data.employeeTypeId,
      statusId:data.statusId,
      startDate: this.setNgbDate(data.startDate),
      terminationDate: this.setNgbDate(data.terminationDate)

    
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
    this.statusDefaultValue = 1;
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
          employeeTypeId: createForm.employeeTypeId,
          statusId: createForm.statusId,
          payType: '',
          startDate: this.setDate(createForm.startDate),
          terminationDate:this.setDate(createForm.terminationDate)
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
          payType: '',
          employeeTypeId: createForm.employeeTypeId,
          statusId: createForm.statusId,
          startDate: this.setDate(createForm.startDate),
          terminationDate:this.setDate(createForm.terminationDate)


        };

        if (model.payTypeCheck) {
          model.payType = 'Salary';
        } else {
          model.payType = 'Hourly';
        }
  
       

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
    this.ngOnInit();
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
        backdropClass: 'static',
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
