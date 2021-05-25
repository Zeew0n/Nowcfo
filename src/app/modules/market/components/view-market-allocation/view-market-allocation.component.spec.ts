import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMarketAllocationComponent } from './view-market-allocation.component';

describe('ViewMarketAllocationComponent', () => {
  let component: ViewMarketAllocationComponent;
  let fixture: ComponentFixture<ViewMarketAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMarketAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMarketAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
