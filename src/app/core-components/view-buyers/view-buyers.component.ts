import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuyersListing, BuyersListingAPIJSON, BuyersListingFilters } from 'src/app/shared/modals/buyersListing';
import { DateFromToJson } from 'src/app/shared/modals/property-listings.modal';
import { DataService } from 'src/app/shared/services/data.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-view-buyers',
  templateUrl: './view-buyers.component.html',
  styleUrls: ['./view-buyers.component.scss']
})
export class ViewBuyersComponent implements OnInit {
  endDate: any;
  startDate: any;
  page: number = 1;
  numberOfRows = [10, 25, 50];
  tableSize: number = 10;
  BuyerListing: BuyersListing[] = [] as BuyersListing[];
  isPageLoader = false;
  isFromDateIsLessThenToDate: boolean = false;
  isDateEmpty: boolean = false;

  constructor(private datePipe: DatePipe, private dataService: DataService, private httpService: HttpService,
    private router: Router, private activatedroute: ActivatedRoute,) {

  }

  ngOnInit(): void {
    const today = new Date();
    const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    this.startDate = this.datePipe.transform(oneMonthAgo, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(today, 'yyyy-MM-dd');


    this.filterDate();
    this.initialApiCall();
    this.initiateObservers();
  }

  initiateObservers() {
    this.dataService.buyerListingsObserver().subscribe(
      response => {
        this.BuyerListing = response;
      },
      err => {
        console.log(err);
      }
    );
  }
  initialApiCall() {
    let staff_id: string = localStorage.getItem('staff_id') ?? '';
    let id = Number(this.activatedroute.snapshot.paramMap.get("id"));
    let purchased_date = this.dataService.buyersListingFiltersSubject.value.purchased_date;
    let asset_id;
    if (id === null || id === 0) {
      asset_id = null;
    } else {
      asset_id = [Number(this.activatedroute.snapshot.paramMap.get("id"))];
    }
    this.isPageLoader = true;
    const input_params: BuyersListingFilters = {
      staff_id: staff_id, asset_id: asset_id, purchased_date, "sort_by": {
        "purchased_date": "DESC"
      }
    } as BuyersListingFilters;
    this.httpService.fetchBuyerListing(input_params).then(
      (response: BuyersListing[] | any) => {
        this.dataService.buyerListingsSubject.next(response);
        this.BuyerListing = response;
        this.isPageLoader = false;
      },
      (error: string) => {
        console.log(error);
        this.isPageLoader = false;
      }
    );
  }
  getUserName(item: BuyersListing): string {
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
    } else if (date.from > date.to) {
      this.isFromDateIsLessThenToDate = true;
    } else {
      date.from = date.from.concat(" 00:00:00");
      date.to = date.to.concat(" 23:59:59");
      let listing_filter = this.dataService.buyersListingFiltersSubject.value;
      listing_filter.purchased_date = date;
      this.dataService.buyersListingFiltersSubject.next(listing_filter);
    }
  }
  setNumberOfRows(value: any): void {
    this.tableSize = value;
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }
  fetchBuyersByDate() {
    if (!this.isFromDateIsLessThenToDate && !this.isDateEmpty) {
      (document.getElementById("buyerlistingLoaderId") as HTMLBodyElement).style.display = "flex";
      this.httpService.fetchBuyerListings(this.dataService.buyersListingFiltersSubject.value).then(
        res => {
          this.dataService.buyerListingsSubject.next(res);
          (document.getElementById("buyerlistingLoaderId") as HTMLBodyElement).style.display = "none";
        },
        err => {
          (document.getElementById("buyerlistingLoaderId") as HTMLBodyElement).style.display = "none";
        }
      );
    }

  }

  routeToKYCProfile(id: number, userId:any): void {
    this.router.navigate(['/profile/' + id]);
     localStorage.setItem('user_id', userId);
  }

  openFilter() {
    (document.getElementById("buyersFiltersId") as HTMLBodyElement).style.display = "flex";
  }

  getTransformedDateTime(value_date: string | null){
    return this.datePipe.transform(value_date, "yyyy-MM-dd", 'UTC');
  }
}
