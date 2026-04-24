import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { KYCLisitingAPIJSON, KYCLisitng, VerifyKYCAPIJSON } from 'src/app/shared/modals/kyc.modal';
import { ApiModal, ModalTypes } from 'src/app/shared/modals/modal.modal';
import { DataService } from 'src/app/shared/services/data.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { web2configurations } from 'src/app/shared/utils/config';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-buyers-profile',
  templateUrl: './buyers-profile.component.html',
  styleUrls: ['./buyers-profile.component.scss']
})
export class BuyersProfileComponent implements OnInit {
  kycListing: KYCLisitng = {} as KYCLisitng;
  kycForm!: FormGroup;
  isPageLoader: boolean = false;
  identityDocument: string[] = [] as string[];
  ccLeafDocument: string[] = [] as string[];
  router: any;

  constructor(private httpService: HttpService,
    private activatedroute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private datePipe: DatePipe
  ) {
    this.kycForm = this.formBuilder.group({
      userName: ['', Validators.required],
      phoneName: ['', Validators.required],
      emailName: ['', Validators.required],
      dobName: ['', Validators.required],
      // addressName: ['', Validators.required],
      // pincodeName: ['', Validators.required],
      walletName: ['', Validators.required],
      // nameBankName: ['', Validators.required],
      // bankName: ['', Validators.required],
      // accountNumberName: ['', Validators.required],
      // bankCodeName: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    let staff_id: string = localStorage.getItem('staff_id') ?? '';
    let kyc_id = Number(this.activatedroute.snapshot.paramMap.get("id")).toString();
    let user_id = localStorage.getItem('user_id') ? [localStorage.getItem('user_id')] : null;
    this.isPageLoader = true;

    const input_params: KYCLisitingAPIJSON = { staff_id: staff_id, filtersByString:{kyc_id:[kyc_id], user_id:user_id},filtersByDate:null} as KYCLisitingAPIJSON;
    this.httpService.fetchUserKYC(input_params).then(
      (response: KYCLisitng[] | any) => {
        this.kycListing = response[0];
        this.kycForm.patchValue({
          userName: this.kycListing.name,
          phoneName: this.kycListing.mobile,
          emailName: this.kycListing.email,
          dobName: this.datePipe.transform(this.kycListing.dob, 'yyyy-MM-dd'),
          // addressName: this.kycListing.address,
          // pincodeName: this.kycListing.pincode,
          walletName: this.kycListing.wallet,
          // nameBankName: this.kycListing.name_as_per_bank,
          // bankName: this.kycListing.bank_name,
          // accountNumberName: this.kycListing.account_number,
          // bankCodeName: this.kycListing.bank_code,
        });

        // for (let itemIndex = 0; itemIndex < this.kycListing.identity_document.length; itemIndex++) {
        //   const element = this.kycListing.identity_document[itemIndex];
        //   this.identityDocument.push(`${web2configurations.CLOUDFRONT_URL}${element.Key}`);
        // }

        // for (let itemIndex = 0; itemIndex < this.kycListing.cancelled_cheque_leaf.length; itemIndex++) {
        //   const element = this.kycListing.cancelled_cheque_leaf[itemIndex];
        //   this.ccLeafDocument.push(`${web2configurations.CLOUDFRONT_URL}${element.Key}`);
        // }

        this.kycForm.disable({ onlySelf: true })
        this.isPageLoader = false;
      },
      (error: string) => {
        console.log(error);
        this.isPageLoader = false;
      }
    );


  }

  getUserName(item: KYCLisitng): string {
    let name: string = '';
    if (item.first_name != null && item.first_name != '' && !item.first_name.includes('null')) {
      name = item.first_name;
    }

    if (item.last_name != null && item.last_name != '' && !item.last_name.includes('null')) {
      name += ' ' + item.last_name;
    }
    return name;
  }

  confirmStatus(key: any) {
    let kycContent = '';
    switch (key) {
      case 'APPROVED':
        kycContent = 'Are you sure you want to approve KYC for this user?'
        break;
      case 'REJECTED':
        kycContent = 'Are you sure you want to reject KYC for this user?'
        break;
      default:
        break;
    }
    let modalItem: ApiModal = {
      title: 'Confirm Submission',
      content: kycContent,
      status: true,
      call: () => {
        switch (key) {
          case 'APPROVED':
            this.actKYC(key);
            break;
          case 'REJECTED':
            this.actKYC(key);
            break;
          default:
            break;
        }
      }
    } as ApiModal
    this.dataService.modalUpdater(ModalTypes.CONFIRM_API).next(modalItem);
  }

  actKYC(act_status: string): void {
    let staff_id: string = localStorage.getItem('staff_id') ?? '';
    let input_params: VerifyKYCAPIJSON = {
      kyc_id: Number(this.activatedroute.snapshot.paramMap.get("id")),
      kyc_status: act_status,
      staff_id: staff_id
    };
    this.isPageLoader = true;
    this.httpService.verifyKYC(input_params).then(
      response => {
        this.kycListing.kyc_status = act_status;
        let modalItem: ApiModal = {
          title: 'KYC Action Succeeded',
          content: `The KYC for ${this.getUserName(this.kycListing)}, has been ${act_status} successfully`,
          status: true,
          router: 'KYC'
        } as ApiModal;
        this.dataService.modalUpdater(ModalTypes.SUCCESS_API).next(modalItem);
        this.isPageLoader = false;
      },
      error => {
        let modalItem: ApiModal = {
          title: 'KYC Action Failed',
          content: `Action not completed, ${error}`,
          status: true,
          router: ''
        } as ApiModal
        this.dataService.modalUpdater(ModalTypes.ERR_API).next(modalItem);
        this.isPageLoader = false;
      }
    );
  }

  getStatusColor(value: string): string {
    let return_style: string = '';

    if (value == "" || value == null || value == undefined) {
      return_style = "fs-10";
    } else {
      if (value === 'APPROVED' || value == "COMMITTED") {
        return_style = "badge badge-success fs-10";
      } else if (value == 'NOT-APPLIED' || value == "REJECTED") {
        return_style = "badge badge-danger fs-10";
      } else {
        return_style = "badge badge-warning fs-10";
      }
    }
    return return_style;
  }

  openUrl(url: string) {
    window.open(url, '_blank');
  }


}
