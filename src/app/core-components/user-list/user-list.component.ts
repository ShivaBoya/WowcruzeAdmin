import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KYCLisitingAPIJSON, KYCLisitng } from 'src/app/shared/modals/kyc.modal';
import { DateFromToJson } from 'src/app/shared/modals/property-listings.modal';
import { DataService } from 'src/app/shared/services/data.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: [DatePipe]
})
export class UserListComponent implements OnInit {
  endDate: any;
  startDate: any;
  page: number = 1;
  numberOfRows = [10, 25, 50];
  tableSize: number = 10;
  UserListing: KYCLisitng[] = [] as KYCLisitng[];
  isPageLoader = false;
  isFromDateIsLessThenToDate: boolean = false;
  isDateEmpty: boolean = false;


  constructor(private datePipe: DatePipe, private dataService: DataService, private httpService: HttpService,
    private router: Router) { }

  ngOnInit(): void {
    const today = new Date();
    const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    this.startDate = this.datePipe.transform(oneMonthAgo, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(today, 'yyyy-MM-dd');
    this.filterDate();
    this.initiateObservers();

    this.isPageLoader = true;
    let staff_id: string = localStorage.getItem('staff_id') ?? '';
    // const input_params: KYCLisitingAPIJSON = { staff_id: staff_id, filtersByString: { kyc_id: null }, filtersByDate: null } as KYCLisitingAPIJSON;

    // this.httpService.fetchUserKYC(input_params).then(
    //   (response: KYCLisitng[] | any) => {
    //     this.UserListing = response;
    //     this.isPageLoader = false;
    //   },
    //   (error: string) => {
    //     console.log(error);
    //     this.isPageLoader = false;
    //   }
    // );

    let listing_filter = this.dataService.kycListingFiltersSubject.value;
    listing_filter.staff_id = staff_id;
    this.dataService.kycListingFiltersSubject.next(listing_filter);
    this.fetchKYCList();
  }

  fetchKYCList() {
    this.httpService.fetchUserKYCList(this.dataService.kycListingFiltersSubject.value).then(
      res => {
        this.dataService.kycListingsSubject.next(res);
        this.UserListing = res;
        this.isPageLoader = false;
      },
      err => {
        console.log(err);
        this.isPageLoader = false;
      }
    );
  }

  initiateObservers() {
    this.dataService.kycListingsObserver().subscribe(
      response => {
        this.UserListing = response;
      },
      err => {
        console.log(err);
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
  filterDate() {
    this.isFromDateIsLessThenToDate = false;
    this.isDateEmpty = false;
    let date: DateFromToJson = {} as DateFromToJson;
    date.from = this.startDate;
    date.to = this.endDate;
    if (date.from === '' || date.to === '') {
      this.isDateEmpty = true;
    }
    else if (date.from > date.to) {
      this.isFromDateIsLessThenToDate = true;
    } else {
      date.from = date.from + " 00:00:00"; // Add the time part to "from" date
      date.to = date.to + " 23:59:59";
      let listing_filter = this.dataService.kycListingFiltersSubject.value;
      listing_filter.filtersByDate.created_at = date;
      this.dataService.kycListingFiltersSubject.next(listing_filter);
    }
  }
  fetchUsersByDate() {
    if (!this.isFromDateIsLessThenToDate && !this.isDateEmpty) {
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
  }

  openKYCFilter() {
    (document.getElementById("kycFiltersId") as HTMLBodyElement).style.display = "flex";
  }

  setNumberOfRows(value: any): void {
    this.tableSize = value;
  }

  routeToKYCProfile(kyc_id: number, id:string): void {
    localStorage.setItem('user_id', id);
    this.router.navigate(['/profile/' + kyc_id]);
  }
}
