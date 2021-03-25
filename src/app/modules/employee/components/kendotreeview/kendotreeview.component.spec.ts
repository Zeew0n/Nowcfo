import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KendotreeviewComponent } from './kendotreeview.component';

describe('KendotreeviewComponent', () => {
  let component: KendotreeviewComponent;
  let fixture: ComponentFixture<KendotreeviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KendotreeviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KendotreeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
