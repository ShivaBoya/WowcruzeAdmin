import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyersProfileComponent } from './buyers-profile.component';

describe('BuyersProfileComponent', () => {
  let component: BuyersProfileComponent;
  let fixture: ComponentFixture<BuyersProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyersProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyersProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
