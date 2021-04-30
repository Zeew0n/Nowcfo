import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketAllocationComponent } from './market-allocation.component';

describe('MarketAllocationComponent', () => {
  let component: MarketAllocationComponent;
  let fixture: ComponentFixture<MarketAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
