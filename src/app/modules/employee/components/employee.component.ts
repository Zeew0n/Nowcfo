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
import { ActivatedRoute, Router } from '@angular/router';
import { RoleModel } from 'src/app/models/role.model';
import AuthenticationService from '../../user-account/services/authentication.service';
import { EmployeeModel } from 'src/app/models/employee.model';
import { DesignationModel } from 'src/app/models/designation.model';
import { EmployeeService } from '../services/employee.service';
import { OrganizationModel } from 'src/app/models/organization.model';
@Component({
  selector: 'app-employee-list',
  styleUrls: ['employee.component.scss'],
  templateUrl: './employee.component.html',
})
export class EmployeeComponent {
  employee: EmployeeModel = new EmployeeModel();
  employees: EmployeeModel[];
  designations: DesignationModel[];
  organizations: OrganizationModel[];
  supervisors: EmployeeModel[];

//Added for dropdown
  title = 'dropdowmcheckbox';
  myForm:FormGroup;
  disabled=false;
  showFilter=false;
  limitSelection=false;
  cities:any=[];
  selectedItems:any=[];
  dropdownSettings:any={};


  isSubmitting: boolean; // Form submission variable
  closeResult = ''; // close result for modal
  submitted = false;
  userId: string = '';
  isEdit: boolean = false;
  selectedSimpleItem = 'User';
  websiteList: any = ['User', 'Admin'];
  simpleItems = [];
  isUpdate = false;
  selectemployee;

  //for checkboxes

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private employeeService: EmployeeService,

    private authService: AuthenticationService,
    private route: ActivatedRoute
  ) {

  }

  /* Form Declarations */
  employeeForm: FormGroup;
  EventValue: any = 'Save';
  //isActive: boolean;
  hasUser: boolean = false;
  hasAdmin: boolean = false;
  hasSuperAdmin: boolean = false;

  employeeName = new FormControl('', [Validators.required]);
  email = new FormControl('', Validators.email);
  phoneNumber = new FormControl('', [Validators.required]);
  address = new FormControl('', [Validators.required]);
  city = new FormControl('', [Validators.required]);
  zipCode = new FormControl('', [Validators.required]);
  organizationId = new FormControl(true, [Validators.required]);
  designationId = new FormControl('', [Validators.required]);
  superVisorId = new FormControl('');
  isSupervisor = new FormControl('');
  payType = new FormControl(true, [Validators.required]);
  pay = new FormControl(true, [Validators.required]);
  overTimeRate = new FormControl(true, [Validators.required]);


  ngOnInit() {
    this.getEmployees();
    this.getOrganizations();
    this.getDesignations();
    this.getSuperVisors();
    this.initializeemployeeForm();

    this.cities=[
      {item_id:1,item_text:'Dehli'},
      {item_id:2,item_text:'Noida'},
      {item_id:3,item_text:'Bangalore'},
      {item_id:4,item_text:'Pune'},
      {item_id:5,item_text:'chennai'},
      {item_id:6,item_text:'Mumbai'},
    ];
    this.selectedItems=[{ item_id:4,item_text:'pune'},{item_id:6,item_text:'Mumbai'}];
    this.dropdownSettings={
      singleSelection:false,
      idField:'item_id',
      textField:'item_text',
      selectAllText:'select All',
      unSelectAllText:'Unselect All',
      itemsShowLimit:1,
      allowSearchFilter:this.showFilter
    };  

    
  }

  checkIsSupervisor(event) {
    console.log('test');
  }

  private checkPermissions() {
    const role = this.authService.getUserRole();

    if (role == 'User') {
      this.hasUser = true;
    } else {
      this.hasUser = false;
    }
    if (role == 'Admin') {
      this.hasAdmin = true;
    } else {
      this.hasAdmin = false;
    }

    if (role == 'SuperAdmin') {
      this.hasSuperAdmin = true;
    } else {
      this.hasSuperAdmin = false;
    }
  }

  get f() {
    return this.employeeForm.controls;
  }

  getEmployees() {
    this.employeeService.GetAllEmployees().subscribe(
      (result) => {
        this.employees = result;
      },
      (error) => console.error
    );
  }

  getDesignations() {
    this.employeeService.GetAllDesignations().subscribe(
      (result) => {
        this.designations = result;
      },
      (error) => console.error
    );
  }

  getSuperVisors() {
    this.employeeService.GetAllSuperVisors().subscribe(
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
      },
      (error) => console.error
    );
  }



  onItemSelect(item:any){
    console.log('onItemSelect', item);
  }
  onSelectAll(item:any){
    console.log('onSelectAll', item);
  }

  

  initializeemployeeForm() {
    this.employeeForm = new FormGroup({
      employeeName: this.employeeName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      address: this.address,
      city: this.city,
      zipCode: this.zipCode,
      organizationId: this.organizationId,
      designationId: this.designationId,
      isSupervisor: this.isSupervisor,
      superVisorId: this.superVisorId,
      payType: this.payType,
      pay: this.pay,
      overTimeRate: this.overTimeRate,
    });
  }

  Delete(id) {
    debugger;
    console.log('Hello Ashok!');
    this.employeeService.DeleteEmployee(id).subscribe(
      (result) => {
        if (confirm(' Are you sure to delete this record? ')) {
          if (result == null) {
            this.modalService.dismissAll();
            this.toastr.success('Employee Delete Successfully.', 'Success!');
            this.getEmployees();
          } else {
            this.toastr.success('Something went Wrong.', 'Error!');
          }
        }
      },
      (error) => {
        console.log(error);
        this.toastr.error(error.error.errorMessage, 'Error!');
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

  onSubmit() {
    debugger;

    const createForm = this.employeeForm.value;
    console.log(createForm);

    if (!this.isUpdate) {
      if (this.employeeForm.valid) {
        const model = new EmployeeModel();
        debugger;
        model.employeeName = createForm.employeeName;
        model.email = createForm.email;
        model.phoneNumber = createForm.phoneNumber;
        model.address = createForm.address;
        model.city = createForm.city;
        model.zipCode = createForm.zipCode;
        model.email = createForm.email;
        model.organizationId = createForm.organizationId;
        model.designationId = createForm.designationId;
        model.isSupervisor = createForm.isSupervisor;
        model.superVisorId = createForm.superVisorId;
        model.payType = createForm.payType;
        model.pay = createForm.pay;
        model.overTimeRate = createForm.overTimeRate;

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
        const model = new EmployeeModel();
        debugger;

        model.employeeName = createForm.employeeName;
        model.email = createForm.email;
        model.phoneNumber = createForm.phoneNumber;
        model.address = createForm.address;
        model.city = createForm.city;
        model.zipCode = createForm.zipCode;
        model.email = createForm.email;
        model.organizationId = createForm.organizationId;
        model.designationId = createForm.designationId;
        model.isSupervisor = createForm.isSupervisor;
        model.superVisorId = createForm.superVisorId;
        model.payType = createForm.payType;
        model.pay = createForm.pay;
        model.overTimeRate = createForm.overTimeRate;
        model.employeeId = this.selectemployee.employeeId;
        this.employeeService.updateEmployee(model.employeeId, model).subscribe(
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

  EditData(content, employee: any) {
    this.isUpdate = true;
    this.isEdit = true;
    this.selectemployee = employee;
    debugger;
    console.log(employee);
    this.EventValue = 'Update';
    this.employeeForm.patchValue({
      employeeName: employee.employeeName,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      address: employee.address,
      city: employee.city,
      zipCode: employee.zipCode,
      organizationId: employee.organizationId,
      designationId: employee.designationId,
      isSupervisor: employee.isSupervisor,
      superVisorId: employee.superVisorId,
      payType: employee.payType,
      pay: employee.pay,
      overTimeRate: employee.overTimeRate,
    });
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'modal-cfo',
    });
  }

  private openModal(content: any) {
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
