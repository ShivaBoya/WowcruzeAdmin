import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPropertyPageComponent } from './add-property-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule, DatePipe } from '@angular/common';
import { delay } from 'rxjs';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

describe('AddPropertyPageComponent', () => {
  let component: AddPropertyPageComponent;
  let component1: ModalComponent;
  let fixture: ComponentFixture<AddPropertyPageComponent>;
  let fixture1: ComponentFixture<ModalComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPropertyPageComponent, ModalComponent],
      imports: [ReactiveFormsModule, HttpClientModule, RouterTestingModule.withRoutes([
        { path: 'property-details/:id', component: AddPropertyPageComponent },
      ]), CommonModule],
      providers: [DatePipe],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPropertyPageComponent);
    fixture1 = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    component1 = fixture1.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  it('should update the sale status', async () => {
    console.log("Routing to property 23 view details");
    await router.navigate(['/property-details/23']);
    // const currentRoute = router.routerState.snapshot.url;
    // await fixture.whenStable();
    // fixture.detectChanges();
    await component.ngOnInit();

    expect(component.isViewDetails).toEqual(true);
    const compiled = fixture.debugElement.nativeElement;
    const compiled1 = fixture1.debugElement.nativeElement;
    // console.log(compiled.querySelectorAll('.nav-link'));
    console.log("Switching to comprehensive details page");
    (compiled.querySelectorAll('.nav-link')[1] as HTMLInputElement).click();

    await fixture.whenStable();
    fixture.detectChanges();
    
    // console.log(compiled.querySelectorAll('.nav-link'));
    expect((compiled.querySelectorAll('.nav-link')[1] as HTMLBodyElement).classList.contains('active')).toBe(true);
    
    expect(component.currentFormPage).toEqual(2);
    
    // console.log(compiled.querySelectorAll('#sale_status_id'));
    
    expect(compiled.querySelector('#sale_status_id')?.innerHTML).toContain('Sale');
    expect(compiled.querySelectorAll('#sale_status_id')[1]?.value).toContain('CREATED');

    console.log("Sale Status selection modal opened");
    (compiled.querySelectorAll('#sale_status_id')[1] as HTMLInputElement).click();

    await fixture.whenStable();
    fixture.detectChanges();

    // console.log(compiled.querySelectorAll('#statusModal h6'));
    expect(compiled.querySelectorAll('#statusModal h6')[0].innerText).toContain('Sale Status Updation');

    console.log("Sale Status seleted");
    component.modalForm.patchValue({"selectedSaleSatus":  'STARTED'});
    await fixture.whenStable();
    fixture.detectChanges();

    // compiled.querySelectorAll('#statusModal .modal-body select').value = 'STARTED';
    expect(compiled.querySelectorAll('#statusModal .modal-body select')[0].value).toBe('STARTED');
    
    await fixture.whenStable();
    fixture.detectChanges();

    // console.log(await compiled.querySelectorAll('#statusModal .modal-footer button')[0]);
    console.log("Opens Confirmation Modal");
    component.statusConfirmationModal('SALE');
    // await (compiled.querySelectorAll('#statusModal .modal-footer button')[0]).click();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture1.whenStable();
    fixture1.detectChanges();
    
    // console.log(compiled1.querySelectorAll('#conformModalHeaderId'));

    expect(compiled1.querySelectorAll('#conformModalHeaderId')[0].innerHTML).toBe('CONFIRM SUBMISSION');

    console.log("Sale Status update confirmed");
    (compiled1.querySelectorAll('#confirmYesButtonId')[0]).click();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture1.whenStable();
    fixture1.detectChanges();
    delay(30000);

    await fixture.whenStable();
    fixture.detectChanges();
    await fixture1.whenStable();
    fixture1.detectChanges();

    // console.log("Sale status updated successfully");
    // console.log((compiled1.querySelectorAll('#successModalHeaderId')[0] as HTMLBodyElement).innerHTML);
    expect((compiled1.querySelectorAll('#successModalHeaderId')[0] as HTMLBodyElement).innerHTML).toBe('Sale Status Updated Successfully');
  });
});
