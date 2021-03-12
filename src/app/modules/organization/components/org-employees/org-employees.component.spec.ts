import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgEmployeesComponent } from './org-employees.component';

describe('OrgEmployeesComponent', () => {
  let component: OrgEmployeesComponent;
  let fixture: ComponentFixture<OrgEmployeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgEmployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
