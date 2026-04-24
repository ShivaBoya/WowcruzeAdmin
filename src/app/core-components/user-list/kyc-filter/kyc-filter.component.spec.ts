import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycFilterComponent } from './kyc-filter.component';

describe('KycFilterComponent', () => {
  let component: KycFilterComponent;
  let fixture: ComponentFixture<KycFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
