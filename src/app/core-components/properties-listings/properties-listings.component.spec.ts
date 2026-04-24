import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesListingsComponent } from './properties-listings.component';

describe('PropertiesListingsComponent', () => {
  let component: PropertiesListingsComponent;
  let fixture: ComponentFixture<PropertiesListingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertiesListingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
