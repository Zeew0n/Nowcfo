import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { NgbModal,NgbDateStruct, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Data, Router } from '@angular/router';
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
import { ThrowStmt } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

const now = new Date();
@Component({
  selector: 'app-employee-page',
  templateUrl: './employeecreate.component.html',
  styleUrls: ['./employeecreate.component.scss'],
})
export class EmployeeCreateComponent implements OnInit {
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
  submitted = false;
  isEdit = false;
  isEmailExists=false;
  stateList: Array<any>;
  selectemployee;
  employeeForm: FormGroup;
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
    private toastr: ToastrService,
    private employeeService: EmployeeService,
    private organizationService: OrganizationService,
    private router: Router,
    private route: ActivatedRoute
  ) {

  this.route.queryParams.subscribe((params) => {
    this.selectedEmployeeId = params['id'];

    });
  if(this.selectedEmployeeId!=null || undefined){
    this.initializeemployeeForm();
    this.EditData(this.selectedEmployeeId);
  }
  else{
    this.initializeemployeeForm();
    this.terminationValidation();


  }

  }



  EventValue: any = 'Save';
  public statusDefaultValue = 1;


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
  pay = new FormControl('', [Validators.required,Validators.pattern(/^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/
    )]);
  employeeTypeId = new FormControl(null,[Validators.required]);
  statusId= new FormControl(1, [Validators.required]);
  overTimeRate = new FormControl('', [Validators.required,Validators.pattern(/^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/
    )]);
  startDate= new FormControl('',[Validators.required]);
  terminationDate= new FormControl('');





  ngOnInit() {
    this.getDesignations();
    this.getOrganizations();
    this.getEmployeeTypes();
    this.getEmployeeStatusTypes();
    this.getSuperVisors();
    this.initializeemployeeForm();
    this.terminationValidation();
    this.statusDefaultValue = 1;
    
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

  checkEmailExists() {
    this.isEmailExists = false;
     var emailValue= this.employeeForm.value.email;
    this.employeeService.checkEmailExists(emailValue).subscribe(
      () => {
        this.isEmailExists = true;
        this.employeeForm.controls.email.setErrors({ 
        })
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



  EditData(id: string) {
    this.isEdit = true;
    this.selectedEmployeeId = id;
    //this.resetFrom();
    this.employeeId = id;
    this.getEmployeeById(id);
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

  getEmployeeById(id: string) {
    this.employeeService.getEmployeeById(id).subscribe(
      (res: EmployeeModel) => {
        this.isEdit = true;
        this.EventValue = 'Update';
        this.displayFormData(res, id);
      },
      (error) => {
        this.toastr.error(
          error.error.errorMessage !== undefined
            ? error.error.errorMessage
            : 'Cannot Load Employee Details!!!',
          'Error!'
        );
      }
    );
  }





  onStateChange(event) {
    if (event !== undefined) {
      this.employeeForm.controls.state.setValue(event.name);
    }
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
            this.router.navigate(['employee/employee-information']);
            //Redirect to EmployeeList page
            //Redirecting msg

          },
          (error) => {
            console.log(error);
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
            //Redirect to EmployeeList page
            //Redirecting msg  
            this.router.navigate(['employee/employee-information']);
        
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



  resetFrom() {
    this.employeeForm.reset();
    this.EventValue = 'Save';
    this.submitted = false;
    this.router.navigate(['employee/employee-information']);

  }


}
