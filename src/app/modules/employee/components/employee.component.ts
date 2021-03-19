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
import AuthenticationService from '../../user-account/services/authentication.service';
import { EmployeeModel } from 'src/app/models/employee.model';
import { DesignationModel } from 'src/app/models/designation.model';
import { EmployeeService } from '../services/employee.service';
import { OrganizationModel } from 'src/app/models/organization.model';
import { DownlineTreeviewItem, TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import csc from 'country-state-city';
import { NavigationService } from '../../navigation/services/navigation.service';
import { EmployeeUpdateModel } from 'src/app/models/EmployeeUpdateModel';
import { analyzeNgModules } from '@angular/compiler';
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

  employeeId = '';


  isSubmitting: boolean; // Form submission variable
  closeResult = ''; // close result for modal
  submitted = false;
  userId: string = '';
  isEdit: boolean = false;
  selectedSimpleItem = 'User';
  websiteList: any = ['User', 'Admin'];
  stateList: Array<any>;
  simpleItems = [];
  isUpdate = false;
  selectemployee;
  selectedEmployeeId:string;

selectedIds=[];


  //for treeview
  values: number[];

  updatevalues: number[];

  rows:number[];

  items= [];

  updateitems=[];

  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: false,
    hasCollapseExpand: true,
    decoupleChildFromParent: true,
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
  hasUser: boolean = false;
  hasAdmin: boolean = false;
  hasSuperAdmin: boolean = false;

  employeeName = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  phoneNumber = new FormControl('', [Validators.required]);
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

  selectParent(id){
    const match = this.selectedIds.find(x=>x===id);
    if(!match){
    this.selectedIds.push(id);
    }
  }

  onSelectedChange(downlineItems: TreeviewItem[]): void {
    this.selectedIds.push('');
    downlineItems.forEach(downlineItem => {
      debugger
      const rec = downlineItem;
    });
    // this.rows = [];
    // downlineItems.forEach(downlineItem => {
    //   const rec = downlineItem;
    //   let parent = downlineItem.parent;
    //   let valueSelected: any = null;
    //   if (parent.item != null && !parent.item.children.some(ele => ele.checked !== true)) {
    //     valueSelected = parent.item.value;
    //     parent = parent.parent;

    //     while (!isNil(parent)) {
    //       if (parent.item != null && !parent.item.children.some(ele => ele.checked !== true)) {
    //         valueSelected = parent.item.value;
    //       }
    //       parent = parent.parent;
    //     }
    //   } else {
    //     valueSelected = downlineItem.item.value;
    //   }


    //   if (!this.rows.some(ele => isEqual(ele, valueSelected)))
    //     this.rows.push(valueSelected);
    // });
  }

  onFilterChange(value: string): void {
    debugger
    alert('ashok');
    console.log('filter:', value);
  }

  checkIsSupervisor(event) {
    console.log('test');
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


 test=[];
  getOrganizatioNavigation() {
    this.navigationService.getOrganizationNavigation().subscribe(
      (res) => {
        this.items.length = 0;
        res.forEach((data) => {
          const item = {
            text: data.text,
            value: data.value,
            collapsed: true,
            checked:false,
            children: data.children,
            level: data.level
          };
          this.items.push(item);
          console.log('Data', this.items);
        });
      },
      (error) => console.error(error)
    );
  }



  getEmployeePermissionNavigation(id:any) {
    this.employeeService.getEmployeePermissionNavigationById(id).subscribe(
      (res) => {
        this.updateitems.length = 0;
        res.forEach((data) => {
          const item = {
            text: data.text,
            value: data.value,
            checked:data.checked,
            collapsed: true,
            children: data.children,
            level: data.level
          };
          this.updateitems.push(item);
          console.log('Data', this.updateitems);
        });
      },
      (error) => console.error(error)
    );
  }



  initializeemployeeForm() {
    this.stateList = csc.getStatesOfCountry('US');
    this.getOrganizatioNavigation();


    this.employeeForm = new FormGroup({
      employeeName: this.employeeName,
      email: this.email,
      phoneNumber: this.phoneNumber,
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


  //Edit
  EditData(content, id: string) {
    this.selectedEmployeeId = id;
    this.resetFrom();
    this.employeeId = id;
   
    this.isUpdate= true;
    this.isEdit = true;
    this.getEmployeeById(id, content);
  }

  private displayFormData(data: EmployeeUpdateModel,id:any) {
    this.getEmployeePermissionNavigation(id);
    this.employeeForm.patchValue({
      employeeName: data.employeeName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
      city: data.city,
      zipCode: data.zipCode,
      state:data.state,
      organizationId: data.organizationId,
      designationId: data.designationId,
      isSupervisor: data.isSupervisor,
      superVisorId: data.superVisorId,
      payType: data.payType,
      payTypeCheck: data.payType == "Salary" ? true : false,
      pay: data.pay,
      overTimeRate: data.overTimeRate,
      orgPermissionId: this.updateitems
    });
  }



  getEmployeeById(id: string, content) {
    debugger
    this.employeeService.getEmployeeById(id).subscribe(
      (res: EmployeeUpdateModel) => {
        if (res)
        this.isEdit = true;
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
    debugger
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
          phoneNumber: createForm.phoneNumber,
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
          payType: "",
          employeepermissions: this.values
        };

        if (model.payTypeCheck) {
          debugger
          model.payType = "Salary";

        }
        else {
          debugger
          model.payType = "Hourly";
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
          phoneNumber: createForm.phoneNumber,
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
          payType: "",
          employeepermissions: this.updatevalues
        };

        if(model.payTypeCheck) {
          
          model.payType = "Salary";

        }
        else {
          
          model.payType = "Hourly";
        }

        this.employeeId = this.selectedEmployeeId;
        debugger
        this.employeeService.updateEmployee(this.employeeId,model).subscribe(
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
