import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DataService } from 'src/app/shared/services/data.service';
import { DateFromToJson, PropertyListings, SaleType, ResaleType, NFTType, SPVType } from 'src/app/shared/modals/property-listings.modal';
import { HttpService } from 'src/app/shared/services/http.service';
import { Router } from '@angular/router';
import { compileFactoryFunction } from '@angular/compiler';


@Component({
  selector: 'app-properties-listings',
  templateUrl: './properties-listings.component.html',
  styleUrls: ['./properties-listings.component.scss'],
  providers: [DatePipe],
})
export class PropertiesListingsComponent implements OnInit {
  endDate: any;
  startDate: any;
  page: number = 1;
  numberOfRows = [10, 25, 50];
  tableSize: number = 10;
  propertyListings: PropertyListings = [] as PropertyListings;
  pro_id: any;
  isFromDateIsLessThenToDate: boolean = false;
  isDateEmpty: boolean = false;
  isViewPropertyVisible = false;
  isViewBuyersVisible = false;
  assetListings:any;

  constructor(private datePipe: DatePipe, private dataService: DataService, private httpService: HttpService, private router: Router) {
  }

  ngOnInit(): void {
    const today = new Date();
    const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    this.startDate = this.datePipe.transform(oneMonthAgo, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(today, 'yyyy-MM-dd');
    // this.filterDate();
    this.initiateObservers();
    this.initiateApiRequests();
    this.fetchProperties();
  }

  initiateObservers() {
    this.dataService.propertyListingsObserver().subscribe(
      response => {
        this.assetListings = response;
      },
      err => {
        console.log(err);
      }
    );
  }

  initiateApiRequests() {
    (document.getElementById("listingLoaderId") as HTMLBodyElement).style.display = "flex";
    if (this.dataService.propertyListingsSubject.value.length <= 0) {
    this.fetchProperties();
    } else {
    this.propertyListings = this.dataService.propertyListingsSubject.value;
    (document.getElementById("listingLoaderId") as HTMLBodyElement).style.display = "none";
    }

    // if (this.dataService.cityAndBrandrSubject.place_filters == undefined) {
    //   // this.fetchCityAndBuilderDetails();
    // }
  }

  fetchProperties() {
    if (!this.isFromDateIsLessThenToDate && !this.isDateEmpty) {
      (document.getElementById("listingLoaderId") as HTMLBodyElement).style.display = "flex";
      this.httpService.fetchPropertyListings(this.dataService.propertyListingFiltersSubject.value, this.page, this.tableSize, localStorage.getItem('staff_id') ?? '').then(
        res => {
          this.dataService.propertyListingsSubject.next(res.data);
          this.assetListings = res?.data;
          (document.getElementById("listingLoaderId") as HTMLBodyElement).style.display = "none";
          this.isFromDateIsLessThenToDate = false;
          this.isDateEmpty = false;
        },
        err => {
          (document.getElementById("listingLoaderId") as HTMLBodyElement).style.display = "none";
          this.isFromDateIsLessThenToDate = false;
          this.isDateEmpty = false;
        }
      );
    }
  }

  fetchCityAndBuilderDetails() {
    this.httpService.fetchDroupdownInfo().then(
      res => {
        this.dataService.cityAndBrandSubject.next(res.data);
      },
      err => {
      }
    );
  }

  getStatusText(value: string, type: string): string {
    let return_value: string = '';
    switch (type) {
      case "SALE":
        return_value = (SaleType as any)[value];
        break;

      case 'RESALE':
        return_value = (ResaleType as any)[value];
        break;

      case 'SPV':
        return_value = (SPVType as any)[value];
        break;

      case 'NFT':
        return_value = (NFTType as any)[value];
        break;

      default:
        return_value = '';
        break;
    }

    return return_value;
  }

  getStatusColor(value: string, type: string): string {
    let return_style: string = '';
    switch (type) {
      case "SALE":
        if (value == "" || value == null || value == undefined) {
          return_style = "fs-10";
        } else {
          if (value === 'COMPLETED' || value == "COMMITTED") {
            return_style = "badge badge-success fs-10 margin-span";
          } else if (value == 'PAUSED' || value == "STOPPED" || value == "ABORTED") {
            return_style = "badge badge-danger fs-10 margin-span";
          } else {
            return_style = "badge badge-warning fs-10 margin-span";
          }
        }
        break;

      case 'RESALE':
        if (value == "" || value == null || value == undefined) {
          return_style = "fs-10";
        } else {
          if (value === 'OPEN') {
            return_style = "badge badge-success fs-10 margin-span";
          } else if (value == 'CLOSED') {
            return_style = "badge badge-danger fs-10 margin-span";
          } else {
            return_style = "badge badge-warning fs-10 margin-span";
          }
        }
        break;

      case 'SPV':
        if (value == "" || value == null || value == undefined) {
          return_style = "fs-10";
        } else {
          if (value === 'FORMED') {
            return_style = "badge badge-success fs-10 margin-span";
          } else if (value == 'UNFORMED') {
            return_style = "badge badge-danger fs-10 margin-span";
          }
        }
        break;

      case 'NFT':
        if (value == "" || value == null || value == undefined) {
          return_style = "fs-10";
        } else {
          if (value === 'ISSUED') {
            return_style = "badge badge-success fs-10 margin-span";
          } else if (value == 'NOT_ISSUED') {
            return_style = "badge badge-danger fs-10 margin-span";
          } else {
            return_style = "badge badge-warning fs-10 margin-span";
          }
        }
        break;

      default:
        break;
    }

    return return_style;
  }

  setNumberOfRows(value: any): void {
    this.tableSize = value;
  }

  filterDate() {
    this.isFromDateIsLessThenToDate = false;
    this.isDateEmpty = false;
    let date: DateFromToJson = {} as DateFromToJson;
    // date.from <= date.to
    date.from = this.startDate;
    date.to = this.endDate;
    if (date.from > date.to) {
      this.isFromDateIsLessThenToDate = true;
    } else if (date.from === '' || date.to === '') {
      this.isDateEmpty = true;
    }
    else {
      date.from = this.startDate + ' 00:00:00';
      date.to = this.endDate + ' 23:59:59';
      let property_listing_filter = this.dataService.propertyListingFiltersSubject.value;
      property_listing_filter.filtersByDate.listing_date = date;
      this.dataService.propertyListingFiltersSubject.next(property_listing_filter);
    }
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  openFilter() {
    (document.getElementById("propertyListingFiltersId") as HTMLBodyElement).style.display = "flex";
  }

  sendPropertyDetails() {
    this.router.navigate(
      ['/property-details', this.pro_id]
    );
  }
  viewBuyersDetails() {
    this.dataService.buyersListingFiltersSubject.value.asset_id = [this.pro_id.toString()];
    this.router.navigate(
      ['/view-buyers/' + this.pro_id]
    );
  }
  openDroupDown(event: any, id: any) {

    let pos = this.getPosition(event);
    const btn = document.getElementById('dropdownMenuButton');
    const droupDown = document.getElementById('detailsDroupDown') as HTMLBodyElement;
    if (this.pro_id === id &&  droupDown.style.display == "block") {
      droupDown.style.display = 'none';
      this.isViewPropertyVisible = false;
      this.isViewBuyersVisible = false;
    }else{
      droupDown.style.display = 'block';
      droupDown.style.position = "absolute";
      droupDown.style.top = (event.clientY - 160) + "px";
      droupDown.style.left = (event.clientX - 20) + "px";
      this.isViewPropertyVisible = true;
      this.isViewBuyersVisible = true;
    }
    this.pro_id = id;
    event.stopPropagation();
  }

  getPosition(event: any) {
    let offsetLeft = 0;
    let offsetTop = 0;

    let el = event.srcElement;

    while (el) {
      offsetLeft += el.offsetLeft;
      offsetTop += el.offsetTop;
      el = el.parentElement;
    }
    return { offsetTop: offsetTop, offsetLeft: offsetLeft }
  }
}
