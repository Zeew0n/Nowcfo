import { Component, ViewChild, } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import {
  NgbModal,
  ModalDismissReasons
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
})
export class UserProfile {


  // Modal Declarations
  closeResult = ''; //close result for modal  
  title = [];
  city =[];
  state =[];
  //Constructor
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService) {
  }

  //ngOnInit
  ngOnInit() {
    this.title = ['Chief Product Officer', 'CTO', 'CEO'];
    this.city = ['Salt Lake City'];
    this.state=['UT']
  }



  //Modal Open and Dismiss
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-harbor' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
}
