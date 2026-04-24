import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyersFilterComponent } from './buyers-filter.component';

describe('BuyersFilterComponent', () => {
  let component: BuyersFilterComponent;
  let fixture: ComponentFixture<BuyersFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyersFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyersFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
