import { Component, OnInit } from '@angular/core';
import { KYCListingFilters, KYCTypeArr } from 'src/app/shared/modals/kyc.modal';
import { DataService } from 'src/app/shared/services/data.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-kyc-filter',
  templateUrl: './kyc-filter.component.html',
  styleUrls: ['./kyc-filter.component.scss']
})
export class KycFilterComponent implements OnInit {
  KYCFilterType: string[] = [];
  kycIdSearchItems: string[] = [];
  userNameSearchItems: string[] = [];
  currentKYCType: string[] = [];
  isKYCIdEmpty: boolean = false;
  searchKYCId : string = '';
  isUserNameEmpty: boolean = true;
  searchUserName : string = '';

  constructor(private dataService: DataService, private httpService: HttpService) { }

  ngOnInit(): void {
    this.defaultFilterValues();
    let staff_id: string = localStorage.getItem('staff_id') ?? '';
    this.dataService.kycListingFiltersSubject.value.staff_id = staff_id;
    this.dataService.kycFiltersObserver().subscribe((res)=>{
      console.log(res);
      if (res.filtersByString.kyc_status!== null && !this.kycIdSearchItems.includes(res.filtersByString.kyc_status.toString())){
        this.kycIdSearchItems= res.filtersByString.kyc_status;
      } else if(res.filtersByString.kyc_status=== null ){
        this.kycIdSearchItems= [];
      }

    }); 
  }

  closePopup() {
    (document.getElementById("kycFiltersId") as HTMLBodyElement).style.display = "none";
  }

  defaultFilterValues() {
    this.KYCFilterType = ['All'].concat(KYCTypeArr);

    this.filterByKYCStatusTypes(null, 'KYC');

    let currentKYCListingFilters = this.dataService.kycListingFiltersSubject.value;

    this.kycIdSearchItems = [];
    currentKYCListingFilters.filtersByString.kyc_status = null;

    this.userNameSearchItems = [];
    currentKYCListingFilters.filtersByString.user_id = null;

    this.updateFilterSubjectUser(currentKYCListingFilters);
  }

  updateFilterSubjectUser(params: KYCListingFilters) {
    this.dataService.kycListingFiltersSubject.next(params);
  }
  getStatusKYCUser(value: string, type: string): string {
    let return_value: string = '';
    
    return_value = (KYCTypeArr as any)[value];
    
    if (return_value == '' || return_value == undefined) {
      return_value = value;
    }
    return return_value;
  }

  onUserNameInputChange(event: any): void {
    this.searchUserName = event.target.value;
    this.isUserNameEmpty = this.searchUserName.length === 0;
  }

  setSearchByFilterItem(value: HTMLInputElement, search_type: string): void {
   if (search_type == "USER_NAME") {
      this.isUserNameEmpty =true;
      this.searchUserName = '';
      if (!this.userNameSearchItems.includes(value.value)) {
        let currentKYCListingFilters = this.dataService.kycListingFiltersSubject.value;
        this.userNameSearchItems.push(value.value);
        currentKYCListingFilters.filtersByString.user_id= this.userNameSearchItems;
        this.updateFilterSubjectUser(currentKYCListingFilters);
      }
    }
    value.value = "";
  }

  removeSearchByFilterItem(value: string, search_type: string) {
    if (search_type == "USER_NAME") {
      let currentKYCListingFilters = this.dataService.kycListingFiltersSubject.value;
      this.userNameSearchItems = this.userNameSearchItems.filter(elem => elem != value);
      // currentKYCListingFilters.filtersByString.first_name = this.userNameSearchItems;
      currentKYCListingFilters.filtersByString.user_id = this.userNameSearchItems.length > 0
      ? this.userNameSearchItems
      : null;
      this.updateFilterSubjectUser(currentKYCListingFilters);
    }
  }

  filterByKYCStatusTypes(value: string | null, type: string): void {
    let currentKYCListingFilters = this.dataService.kycListingFiltersSubject.value;
    switch (type) {
      case 'KYC':
        if (value == null || value == undefined) {
          this.currentKYCType = [];
          currentKYCListingFilters.filtersByString.kyc_status = null;
        } else if (value == 'All') {
          this.currentKYCType = ['All'];
          currentKYCListingFilters.filtersByString.kyc_status = null;
        } else {
          this.currentKYCType = this.currentKYCType.filter((item: string) => item != 'All');
          if (!this.currentKYCType.includes(value)) {
            this.currentKYCType.push(value);
          } else {
            this.currentKYCType = this.currentKYCType.filter((item: string) => item != value);
          }
          currentKYCListingFilters.filtersByString.kyc_status = this.currentKYCType.length == 0 ? null : this.currentKYCType;
          let a:any=currentKYCListingFilters.filtersByString.kyc_status;
          currentKYCListingFilters.filtersByString.kyc_status = a.map(function(x:any){ return x.toUpperCase(); })
        }
        break;

      default:
        console.log('No Filter Type specified');
        break;
    }
  }
  fetchKYCList() {
    (document.getElementById("kycListingLoaderId") as HTMLBodyElement).style.display = "flex";
    this.httpService.fetchUserKYCList(this.dataService.kycListingFiltersSubject.value).then(
      res => {
        this.dataService.kycListingsSubject.next(res);
        (document.getElementById("kycListingLoaderId") as HTMLBodyElement).style.display = "none";
      },
      err => {
        (document.getElementById("kycListingLoaderId") as HTMLBodyElement).style.display = "none";
      }
    );
  }
  applyKYCFilter(){
    this.fetchKYCList();
    this.closePopup();
  }
  clearFilter() {
    this.defaultFilterValues();
    this.fetchKYCList();
  }
}
