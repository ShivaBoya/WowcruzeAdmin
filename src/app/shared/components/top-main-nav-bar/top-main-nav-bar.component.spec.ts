import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopMainNavBarComponent } from './top-main-nav-bar.component';

describe('TopMainNavBarComponent', () => {
  let component: TopMainNavBarComponent;
  let fixture: ComponentFixture<TopMainNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopMainNavBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopMainNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
