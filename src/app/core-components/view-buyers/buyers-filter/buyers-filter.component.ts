import { Component, OnInit } from '@angular/core';
import { BuyersListingFilters, NFTTypeArr, NFTTypeBuyer } from 'src/app/shared/modals/buyersListing';
import { DataService } from 'src/app/shared/services/data.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-buyers-filter',
  templateUrl: './buyers-filter.component.html',
  styleUrls: ['./buyers-filter.component.scss']
})
export class BuyersFilterComponent implements OnInit {

  propertyIdSearchItems: string[] = [];
  propertyNameSearchItems: string[] = [];
  buyerNameSearchItems: string[] = [];
  NFTFilterType: string[] = [];
  currentNFTType: string[] = [];
  searchPropertyId = '';
  searchPropertyName = '';
  searchBuyersName = '';
  isPropertyNameEmpty = true;
  isPropertyIdEmpty = true;
  isPropertyBuyerNameEmpty = true;
  buyerName = '';
  constructor(private dataService: DataService, private httpService: HttpService) { }

  ngOnInit(): void {
    this.defaultFilterValues();
    let staff_id: string = localStorage.getItem('staff_id') ?? '';
    this.dataService.buyersListingFiltersSubject.value.staff_id = staff_id;
    this.dataService.buyerFiltersObserver().subscribe((res)=>{
      console.log(res);
      if (res.asset_id !== null && !this.propertyIdSearchItems.includes(res.asset_id.toString())){
        this.propertyIdSearchItems= res.asset_id;
      } else if(res.asset_id === null ){
        this.propertyIdSearchItems= [];
      }

    });   
  }
  closePopup() {
    (document.getElementById("buyersFiltersId") as HTMLBodyElement).style.display = "none";
  }

  defaultFilterValues() {
    this.NFTFilterType = ['All'].concat(NFTTypeArr);

    this.filterByPropertyStatusTypesBuyers(null, 'NFT');

    let currentBuyersListingFilters = this.dataService.buyersListingFiltersSubject.value;

    this.propertyIdSearchItems = [];
    currentBuyersListingFilters.asset_id = null;

    this.propertyNameSearchItems = [];
    currentBuyersListingFilters.search_by.asset_name = null;

    this.buyerNameSearchItems = [];
    currentBuyersListingFilters.name= null;
    currentBuyersListingFilters.last_name= null;

    this.updateFilterSubjectBuyer(currentBuyersListingFilters);
  }
  onPropertyIdInputChange(event: any): void {
    this.searchPropertyId = event.target.value;
    this.isPropertyIdEmpty = this.searchPropertyId.length === 0;
  }
  onPropertyNameInputChange(event: any): void {
    this.searchPropertyName = event.target.value;
    this.isPropertyNameEmpty = this.searchPropertyName.length === 0;
  }
  onPropertyBuyerNameInputChange(event: any): void {
    this.searchBuyersName = event.target.value;
    this.isPropertyBuyerNameEmpty = this.searchBuyersName.length === 0;
  }
  setSearchByFilterItem(value: HTMLInputElement, search_type: string): void {
    if (search_type == 'asset_id') {
      this.isPropertyIdEmpty = true;
      this.searchPropertyId = '';
      if (!this.propertyIdSearchItems.includes(value.value)) {
        let currentPropertyListingFilters = this.dataService.buyersListingFiltersSubject.value;
        this.propertyIdSearchItems.push(value.value);
        currentPropertyListingFilters.asset_id= this.propertyIdSearchItems;
        this.updateFilterSubjectBuyer(currentPropertyListingFilters);
      }
    } else if (search_type == "PROPERTY_NAME") {
      this.isPropertyNameEmpty =true;
      this.searchPropertyName = '';
      if (!this.propertyNameSearchItems.includes(value.value)) {
        let currentPropertyListingFilters = this.dataService.buyersListingFiltersSubject.value;
        this.propertyNameSearchItems.push(value.value);
        currentPropertyListingFilters.search_by.asset_name = this.propertyNameSearchItems;
        this.updateFilterSubjectBuyer(currentPropertyListingFilters);
      }
    }
    else if (search_type == "BUYER_NAME") {
      this.isPropertyBuyerNameEmpty =true;
      this.searchBuyersName = '';
      if (!this.buyerNameSearchItems.includes(value.value)) {
        let currentPropertyListingFilters = this.dataService.buyersListingFiltersSubject.value;
        this.buyerNameSearchItems.push(value.value);
        currentPropertyListingFilters.name = this.buyerNameSearchItems;
        this.updateFilterSubjectBuyer(currentPropertyListingFilters);
      }
    }
    value.value = "";
  }
  updateFilterSubjectBuyer(params: BuyersListingFilters) {
    this.dataService.buyersListingFiltersSubject.next(params);
  }
  getStatusNftBuyer(value: string, type: string): string {
    let return_value: string = '';
    
    return_value = (NFTTypeBuyer as any)[value];
    
    if (return_value == '' || return_value == undefined) {
      return_value = value;
    }
    return return_value;
  }
  filterByPropertyStatusTypesBuyers(value: string | null, type: string): void {
    let currentBuyersListingFilters = this.dataService.buyersListingFiltersSubject.value;
    switch (type) {
      case 'NFT':
        if (value == null || value == undefined) {
          this.currentNFTType = [];
          currentBuyersListingFilters.coin_status = null;
        } else if (value == 'All') {
          this.currentNFTType = ['All'];
          currentBuyersListingFilters.coin_status = this.NFTFilterType.filter((item: string) => item != 'All');
        } else {
          this.currentNFTType = this.currentNFTType.filter((item: string) => item != 'All');
          if (!this.currentNFTType.includes(value)) {
            this.currentNFTType.push(value);
          } else {
            this.currentNFTType = this.currentNFTType.filter((item: string) => item != value);
          }
          currentBuyersListingFilters.coin_status = this.currentNFTType.length == 0 ? null : this.currentNFTType;
        }
        break;

      default:
        console.log('No Filter Type specified');
        break;
    }
    this.updateFilterSubjectBuyer(currentBuyersListingFilters);
  }
  removeSearchByFilterItem(value: string, search_type: string) {
    if (search_type == 'asset_id') {
      let currentBuyersListingFilters = this.dataService.buyersListingFiltersSubject.value;
      this.propertyIdSearchItems = this.propertyIdSearchItems.filter(elem => elem != value);
      // currentBuyersListingFilters.asset_id = this.propertyIdSearchItems;
      currentBuyersListingFilters.asset_id = this.propertyIdSearchItems.length > 0
      ? this.propertyIdSearchItems
      : null;
      this.updateFilterSubjectBuyer(currentBuyersListingFilters);
    } else if (search_type == "PROPERTY_NAME") {
      let currentBuyersListingFilters = this.dataService.buyersListingFiltersSubject.value;
      this.propertyNameSearchItems = this.propertyNameSearchItems.filter(elem => elem != value);
      // currentBuyersListingFilters.search_by.property_name = this.propertyNameSearchItems;
      currentBuyersListingFilters.search_by.asset_name = this.propertyNameSearchItems.length > 0
      ? this.propertyNameSearchItems
      : null;
      this.updateFilterSubjectBuyer(currentBuyersListingFilters);
    }
    else if (search_type == "BUYER_NAME") {
      let currentBuyersListingFilters = this.dataService.buyersListingFiltersSubject.value;
      this.buyerNameSearchItems = this.buyerNameSearchItems.filter(elem => elem != value);
      // currentBuyersListingFilters.name = this.buyerNameSearchItems;
      currentBuyersListingFilters.name = this.buyerNameSearchItems.length > 0
      ? this.buyerNameSearchItems
      : null;
      this.updateFilterSubjectBuyer(currentBuyersListingFilters);
    }
  }

  fetchProperties() {
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
  applyBuyerFilter(){
    this.fetchProperties();
    this.closePopup();
  }
  clearFilter() {
    this.defaultFilterValues();
    this.fetchProperties();
    this.closePopup();
  }
}
