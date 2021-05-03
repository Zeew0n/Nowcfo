import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMarketAllocationComponent } from './create-market-allocation.component';

describe('CreateMarketAllocationComponent', () => {
  let component: CreateMarketAllocationComponent;
  let fixture: ComponentFixture<CreateMarketAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMarketAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMarketAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
