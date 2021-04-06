import {Component, OnInit} from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal,ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { DesignationModel } from 'src/app/models/designation.model';
import { DesignationService } from '../../services/employeerole.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-employeerole',
  styleUrls: ['employeerole.component.scss'],
  templateUrl: './employeerole.component.html',
})
export class EmployeeRoleComponent implements OnInit{
  designation: DesignationModel = new DesignationModel();
  designations: DesignationModel[];
  closeResult = ''; // close result for modal
  isEdit = false;

  selectemployeerole;
  selectedDesignationId: number;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private designationService: DesignationService,
    private route: ActivatedRoute,
    private ngxUiLoaderService: NgxUiLoaderService,
  ) {}

  designationForm: FormGroup;
  EventValue: any = 'Save';

  designationId = new FormControl('');
  designationName = new FormControl('', [Validators.required]);

  ngOnInit() {
    this.getRoles();
    this.initializeEmployeeRoleForm();
  }

  getRoles() {
    this.designationService.getAllRoles().subscribe(
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
    });
  }
  openDeleteModal(content, id) {
    this.EventValue = 'Delete';
    this.selectedDesignationId = id;
    this.openModal(content);
  }

  Delete() {
    this.ngxUiLoaderService.start();
    this.designationService.deleteDesignation(this.selectedDesignationId).subscribe(
      (result) => {
        if (result == null) {
          this.modalService.dismissAll();
          this.toastr.success('Role deleted successfully.', 'success!');
          this.getRoles();
        } else {
          this.toastr.success('something went wrong.', 'error!');
        }
        this.ngxUiLoaderService.stop();
      },
      (error) => {
        console.log(error.errorMessage);
        this.toastr.error('Cannot delete role', 'error!');
        this.ngxUiLoaderService.stop();
      }
    );
  }

  open(content) {
    this.resetFrom();
    this.isEdit = false;
    this.designation = null;
    this.openModal(content);
  }

  onSubmit() {
    this.ngxUiLoaderService.start();
    const createForm = this.designationForm.value;
    console.log(createForm);
    if (!this.isEdit) {
      if (this.designationForm.valid) {
        const model = new DesignationModel();
        model.designationName = createForm.designationName;
        this.designationService.createDesignation(model).subscribe(
          (res) => {
            this.toastr.success('Designation Added Successfully.', 'Success!');
            this.modalService.dismissAll();
            this.getRoles();
            this.ngxUiLoaderService.stop();
          },
          (error) => {
            console.log(error);
            this.modalService.dismissAll();
            this.toastr.error(error.error.errorMessage, 'Error!');
            this.ngxUiLoaderService.stop();
          }
        );
      }
    } else {

      if (this.designationForm.valid) {
     const model = new DesignationModel();
     model.designationName = createForm.designationName;
     model.id = this.selectemployeerole.designationId;
     this.designationService.updateDesignation(model.id, model).subscribe(
        (res) => {
          this.toastr.success('Designation Updated Successfully.', 'Success!');
          this.modalService.dismissAll();
          this.getRoles();
          this.ngxUiLoaderService.stop();
        },
        (error) => {
          this.toastr.error(
            error.error.errorMessage !== undefined
              ? error.error.errorMessage
              : 'designation Update failed',
            'Error!'
          );
          this.ngxUiLoaderService.stop();
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
    this.designationForm.reset();
    this.EventValue = 'Save';
    this.designation = null;
  }

  EditData(content, designation: any) {
    this.isEdit = true;
    this.selectemployeerole = designation;
    console.log(designation);
    this.EventValue = 'Update';
    this.designationForm.patchValue({
      designationName: designation.designationName,
      designationId: designation.designationId,
    });
    this.openModal(content);
  }


  onFilterChange(value: string): void {
    console.log('filter:', value);
  }

  openModal(content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'modal-cfo',
        backdropClass: 'static',
        backdrop: false
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
