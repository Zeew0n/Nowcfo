import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss']
})
export class ChildComponent implements OnInit {
@Input() children;
@Input() isFirstChild;
@Input() selectedItemIds;
@Output() id =new EventEmitter<any>();
@Output() childId =new EventEmitter<any>();

 constructor() { }

  ngOnInit(): void {
  }

  sendIdToParent(item){
    const match = this.selectedItemIds.find(x=>x===item.value);
    if(!match){
      this.id.emit(item);
  }
  }
  
  onIdFromChild(item){
    const child = this.children.find(x=>x.value===item.value);
    if(child){
    if(child.level==2){
      this.id.emit(item);
    }else{
    if(child && !child.isSelected){
    this.childId.emit(item);
    }
  }
  } else{
    const child = this.children.find(x=>x.value===item.parentOrganizationId);
    if(child.level==2){
      this.id.emit(item);
    }else{
    if(child && !child.isSelected){
    this.childId.emit(item);
    }
  }
  }
  }

}
