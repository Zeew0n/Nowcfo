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
  dropdownEmailAttachmentSettings: any = {};

  //Added for dropdown
  title = 'dropdowmcheckbox';
  disabled = false;
  showFilter = false;
  limitSelection = false;
  cities: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};

  emailAttachmentList: Array<any> = [];


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
  email = new FormControl('', [Validators.required,Validators.email]);
  phoneNumber = new FormControl('', [Validators.required]);
  address = new FormControl('', [Validators.required]);
  city = new FormControl('', [Validators.required]);
  zipCode = new FormControl('', [Validators.required]);
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
    //this.getSuperVisors();
    this.initializeemployeeForm();

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

  checkIsSupervisor(event) {
    console.log('test');
    //this.getSuperVisors(id);
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

  getSuperVisors(id) {
    debugger
    this.employeeService.GetAllSuperVisors(id.value).subscribe(
      (result) => {
        this.supervisors = result;
        console.log('test', this.supervisors);
      },
      (error) => console.error
    );
  }

  getOrganizations() {
    this.employeeService.GetAllOrganizations().subscribe(
      (result) => {
        console.log(result);
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
      payTypeCheck: this.payTypeCheck,
      pay: this.pay,
      overTimeRate: this.overTimeRate,
      orgPermissionId: this.orgPermissionId
    });
  }

  Delete(id) {

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
    debugger

    const createForm = this.employeeForm.value;
    console.log(createForm);

    if (!this.isUpdate) {
      if (this.employeeForm.valid) {
        //const model = new EmployeeModel();
        // model.employeeName = createForm.employeeName;
        // model.email = createForm.email;
        // model.phoneNumber = createForm.phoneNumber;
        // model.address = createForm.address;
        // model.city = createForm.city;
        // model.zipCode = createForm.zipCode;
        // model.email = createForm.email;
        // model.organizationId = createForm.organizationId;
        // model.designationId = createForm.designationId;
        // model.isSupervisor = createForm.isSupervisor;
        // model.superVisorId = createForm.superVisorId;
        // model.pay = createForm.pay;
        // model.payType == createForm.payType?true:false;
        // model.overTimeRate = createForm.overTimeRate;
        // model.employeepermissions = createForm.orgPermissionId?.map(x => x.item_id)

        const model = {
          employeeName: createForm.employeeName,
          email: createForm.email,
          phoneNumber: createForm.phoneNumber,
          address: createForm.address,
          city: createForm.city,
          zipCode: createForm.zipCode,
          organizationId: createForm.organizationId,
          designationId: createForm.designationId,
          isSupervisor: createForm.isSupervisor,
          superVisorId: createForm.superVisorId,
          payTypeCheck: createForm.payTypeCheck ? true : false,
          pay: createForm.pay,
          overTimeRate: createForm.overTimeRate,
          payType: "",
          employeepermissions: createForm.orgPermissionId?.map(x => x.item_id)
        };

        if(model.payTypeCheck)
        
      {
        debugger
        model.payType= "Salary";

      }
        else
        {
          debugger
          model.payType="Hourly";
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
      payTypeCheck:employee.payType=="Salary"?true:false,
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
