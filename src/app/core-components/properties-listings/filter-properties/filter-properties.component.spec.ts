import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterPropertiesComponent } from './filter-properties.component';

describe('FilterPropertiesComponent', () => {
  let component: FilterPropertiesComponent;
  let fixture: ComponentFixture<FilterPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
