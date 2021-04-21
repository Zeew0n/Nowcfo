import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EmployeeModel } from 'src/app/models/employee.model';
import { EmployeePermission } from 'src/app/models/employeepermission.model';
import { OrganizationModel } from 'src/app/models/organization.model';
import { OrganizationService } from 'src/app/modules/organization/services/organization.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-permission',
  templateUrl: './employee-permission.component.html',
  styleUrls: ['./employee-permission.component.scss']
})
export class EmployeePermissionComponent implements OnInit {

  employeePermission: EmployeePermission = new EmployeePermission();
  employees: EmployeeModel[];
  employeePermissions: EmployeePermission[];
  organizations: OrganizationModel[];
  organizationslist: OrganizationModel[];
  levelOrganizations: OrganizationModel[];
  levelTwoOrganizations: OrganizationModel[];
  disabled = false;
  isEdit: boolean=false;
  closeResult = '';
  selectedEmployeeId: string;
  permissionId='';

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private employeeService: EmployeeService,
    private organizationService: OrganizationService,
    private route: ActivatedRoute
  ) {}


  employeePermissionForm: FormGroup;
  EventValue: any = 'Save';
  employeeId = new FormControl(null, [Validators.required]);
  levelOne = new FormControl(null, [Validators.required]);
  levelTwo= new FormControl(null, [Validators.required]);
  levelThree = new FormControl(null, [Validators.required]);
  referenceId = new FormControl(null, [Validators.required]);


  ngOnInit() {

    this.initializeemployeePermissionForm();
    this.getEmployees();
    this.getOrganizations();
    this.getEmployeePermissions();

  }


  getLevelOrganizations(id) {
    
    this.employeeService.getLevelOrganizations(id.value).subscribe(
      (result) => {
        this.levelOrganizations = result;
      },
      (error) => console.error
    );
  }


  getLevelTwoOrganizations(id) {
    this.employeeService.getLevelOrganizations(id.value).subscribe(
      (result) => {
        this.levelTwoOrganizations = result;
      },
      (error) => console.error
    );
  }



  getOrganizations() {
    this.organizationService.getAllHeadOrganizations().subscribe(
      (result) => {
        this.organizations = result;
      },
      () => console.error
    );
  }

  getEmployees() {
    this.employeeService.getAllEmployees().subscribe(
      (result) => {
        this.employees = result;
      },
      () => console.error
    );
  }


  getEmployeePermissions() {
    this.employeeService.getAllEmployeePermissions().subscribe(
      (result) => {
        this.employeePermissions = result;
      },
      () => console.error
    );
  }



  initializeemployeePermissionForm() {

    this.employeePermissionForm = new FormGroup({
      employeeId: this.employeeId,
      levelOne: this.levelOne,
      levelTwo: this.levelTwo,
      levelThree: this.levelThree,
      referenceId: this.referenceId

    });
  }



  EditData(content, id: string) {
    
    this.isEdit = true;
    this.selectedEmployeeId = id;
    this.resetFrom();
    this.permissionId = id;
    this.getEmployeePermissonById(id, content);
  }

  private displayFormData(data: EmployeePermission, id: any) {


    this.employeePermissionForm.patchValue({
      
      employeeId: data.employeeId,
      levelOne:data.levelOne,
      levelTwo:data.levelTwo,
      levelThree:data.levelThree,
      referenceId:data.referenceId
    });
  }

  getEmployeePermissonById(id: string, content) {
    this.employeeService.getEmployeePermissionById(id).subscribe(
      (res: EmployeePermission) => {
        this.isEdit = true;
        this.EventValue = 'Update';
        this.displayFormData(res, id);
        this.employeeService.getLevelOrganizations(res.levelOne).subscribe(
          (result) => {
            this.levelOrganizations = result;
            this.employeeService.getLevelOrganizations(res.levelTwo).subscribe(
              (result) => {
                this.levelTwoOrganizations = result;
                this.openModal(content);
              },
              (error) => console.error
            );
          },
          (error) => console.error
        );
      },
      (error) => {
        this.toastr.error(
          error.error.errorMessage !== undefined
            ? error.error.errorMessage
            : 'Permission not accessible!',
          'Error!'
        );
      }
    );
  }


  open(content) {
    this.resetFrom();
    this.isEdit = false;
    this.openModal(content);
  }



  onSubmit() {
    const createForm = this.employeePermissionForm.value;
    if (!this.isEdit) {
      if (this.employeePermissionForm.valid) {
        const model = {
          employeeId: createForm.employeeId,
          levelOne: createForm.levelOne,
          levelTwo: createForm.levelTwo,
          levelThree: createForm.levelThree,
          referenceId: createForm.referenceId,
     
        };

        this.employeeService.createEmployeePermission(model).subscribe(
          () => {
            this.toastr.success('Permission Added Successfully.', 'Success!');
            this.modalService.dismissAll();
            this.getEmployeePermissions();
          },
          (error) => {
            console.log(error);
            this.modalService.dismissAll();
            this.toastr.error(error.error.errorMessage, 'Error!');
          }
        );
      }
    } else {
      if (this.employeePermissionForm.valid) {
        const model = {
          permissionId:this.selectedEmployeeId,
          employeeId: createForm.employeeId,
          levelOne: createForm.levelOne,
          levelTwo: createForm.levelTwo,
          levelThree: createForm.levelThree,
          referenceId: createForm.referenceId,
 
        };

        this.employeeService.updateEmployeePermission(this.permissionId, model).subscribe(
          () => {
            this.toastr.success('Employee Permission Updated Successfully.', 'Success!');
            this.modalService.dismissAll();
            this.getEmployeePermissions();
          },
          (error) => {
            this.toastr.error(
              error.error.errorMessage !== undefined
                ? error.error.errorMessage
                : 'Employee Permission Update failed',
              'Error!'
            );
          }
        );
      }
    }
  }


  openDeleteModal(content, id) {
    this.EventValue = 'Delete';
    this.selectedEmployeeId = id;
    this.openModal(content);
  }

  Delete() {
    this.employeeService.deleteEmployeePermission(this.selectedEmployeeId).subscribe(
      (result) => {
        if (result == null) {
          this.modalService.dismissAll();
          this.toastr.success('Employee Permission delete successfully.', 'success!');
          this.getEmployeePermissions();
        } else {
          this.toastr.success('something went wrong.', 'error!');
        }
      },
      (error) => {
        console.log(error.errorMessage);
        this.toastr.error('Cannot delete employee permission', 'error!');
      }
    );
  }

  resetFrom() {
    this.employeePermissionForm.reset();
    this.EventValue = 'Save';
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
