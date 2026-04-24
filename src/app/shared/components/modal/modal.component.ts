import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ApiModal, ModalTypes } from '../../modals/modal.modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  errorModal: ApiModal = {
    title: "",
    content: "",
    status: false,
  } as ApiModal;

  successModal: ApiModal = {
    title: "",
    content: "",
    status: false,
  } as ApiModal;

  confirmModal: ApiModal = {
    title: "",
    content: "",
    status: false,
  } as ApiModal;

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.dataService.modalObservers(ModalTypes.ERR_API).subscribe(data => {
      this.errorModal = data;
    });
    this.dataService.modalObservers(ModalTypes.SUCCESS_API).subscribe(data => {
      this.successModal = data;
    });
    this.dataService.modalObservers(ModalTypes.CONFIRM_API).subscribe(data => {
      this.confirmModal = data;
    });
  }

  closeModal(which_modal: ApiModal, modal_type: string): void {
    which_modal.content = '';
    which_modal.title = '';
    which_modal.status = false;
    if (which_modal.call != undefined) { 
      which_modal.call(); 
    }

    if (which_modal.router === 'Property') {
      this.router.navigate(
        ['']
      );
    }
    if (which_modal.router === 'KYC') {
      this.router.navigate(['/kyc-list/']);
    }
    which_modal.router = '';
    this.dataService.modalUpdater(modal_type).next(which_modal);
  }

  closePopup(which_modal: ApiModal, modal_type: string) {
    which_modal.content = '';
    which_modal.title = '';
    which_modal.status = false;
    which_modal.router = '';
    this.dataService.modalUpdater(modal_type).next(which_modal);
  }

}
