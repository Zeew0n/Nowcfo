import {Component} from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal,ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
//import AuthenticationService from '../../user-account/services/authentication.service';
import { DesignationModel } from 'src/app/models/designation.model';
import { DesignationService } from '../services/employeerole.service';
@Component({
  selector: 'app-employeerole',
  styleUrls: ['employeerole.component.scss'],
  templateUrl: './employeerole.component.html',
})
export class EmployeeRoleComponent {
  designation: DesignationModel = new DesignationModel();
  designations: DesignationModel[];

  isSubmitting: boolean; // Form submission variable
  closeResult = ''; // close result for modal
  submitted = false;

  // designationId: number;
  isEdit = false;
  isUpdate = false;

  selectemployeerole;
  selectedDesignationId: number;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private designationService: DesignationService,
    private route: ActivatedRoute
  ) {}

  /* Form Declarations */
  designationForm: FormGroup;
  EventValue: any = 'Save';

  designationId = new FormControl('');
  designationName = new FormControl('', [Validators.required]);
  isActive = new FormControl(true);

  ngOnInit() {
    this.getRoles();
    this.initializeEmployeeRoleForm();
  }

  getRoles() {
    this.designationService.GetAllRoles().subscribe(
      (result) => {
        this.designations = result;
      },
      (error) => console.error
    );
  }

  initializeEmployeeRoleForm() {
    this.designationForm = new FormGroup({
      designationId: this.designationId,
      designationName: this.designationName,
      isActive: this.isActive
    });
  }
  openDeleteModal(content, id) {
    debugger
    this.EventValue = 'Delete';
    this.selectedDesignationId = id;
    this.openModal(content);
  }


  Delete() {
    debugger
    this.designationService.DeleteDesignation(this.selectedDesignationId).subscribe(
      (result) => {
        if (result == null) {
          this.modalService.dismissAll();
          this.toastr.success('Role deleted successfully.', 'success!');
          this.getRoles();
        } else {
          this.toastr.success('something went wrong.', 'error!');
        }
      },
      (error) => {
        console.log(error.errorMessage);
        this.toastr.error('Cannot delete role', 'error!');
      }
    );
  }
  open(content) {
    this.isUpdate = false;
    this.resetFrom();
    this.isEdit = false;
    this.designation = null;
    this.openModal(content);
  }

  onSubmit() {
    debugger
    const createForm = this.designationForm.value;
    console.log(createForm);

    if (!this.isEdit) {
      if (this.designationForm.valid) {
        const model = new DesignationModel();

        model.designationName = createForm.designationName;
        model.isActive = createForm.isActive ? true : false;
        this.designationService.CreateDesignation(model).subscribe(
          (res) => {
            this.submitted = true;
            this.toastr.success('Designation Added Successfully.', 'Success!');
            this.modalService.dismissAll();
            this.getRoles();
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

      if (this.designationForm.valid) {

     const model = new DesignationModel();

     model.designationName = createForm.designationName;
     model.isActive = createForm.isActive;
     model.id = this.selectemployeerole.designationId;
     this.designationService.UpdateDesignation(model.id, model).subscribe(
        (res) => {
          this.toastr.success('Designation Updated Successfully.', 'Success!');
          this.modalService.dismissAll();
          this.getRoles();
        },
        (error) => {
          this.toastr.error(
            error.error.errorMessage !== undefined
              ? error.error.errorMessage
              : 'designation Update failed',
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
    this.designationForm.reset();
    this.EventValue = 'Save';
    this.submitted = false;
    this.designation = null;
  }

  EditData(content, designation: any) {
    this.isUpdate = true;
    this.isEdit = true;
    this.selectemployeerole = designation;
    console.log(designation);
    this.EventValue = 'Update';
    this.designationForm.patchValue({
      designationName: designation.designationName,
      designationId: designation.designationId,
      isActive:designation.isActive
    });
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'modal-cfo',
      backdrop: 'static'
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
