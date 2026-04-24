import { Component, OnInit } from '@angular/core';
import { SaleTypeArr, ResaleTypeArr, NFTTypeArr, SPVTypeArr, PropertyListingFilters, SaleType, ResaleType, SPVType, NFTType, CityAndBrandDetails, PlaceDetails, LocationsDetails, NumberFromToJson, PropertyTypes, BuildersDetails} from '../../../shared/modals/property-listings.modal';
import { DataService } from 'src/app/shared/services/data.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface IActiveLocations {
  [key: string]: any[];
}

@Component({
  selector: 'app-filter-properties',
  templateUrl: './filter-properties.component.html',
  styleUrls: ['./filter-properties.component.scss']
})

export class FilterPropertiesComponent implements OnInit {
  // propertyListings: PropertyListings = [] as PropertyListings;
  disableApplyButtonCondition = true;
  isPropertyIdEmpty = true;
  isPropertyNameEmpty = true;
  searchPropertyName = '';
  searchPropertyId = '';
  isPriceDetailsComplete = false;
  saleFilterType: string[] = [];
  currentSaleType: string[] = [];
  SPVFilterType: string[] = [];
  currentSPVType: string[] = [];
  NFTFilterType: string[] = [];
  currentNFTType: string[] = [];
  resaleFilterType: string[] = [];
  currentResaleType: string[] = [];
  cityAndBuildersDetails: CityAndBrandDetails = {} as CityAndBrandDetails;
  currentCity: PlaceDetails[] = [] as PlaceDetails[];
  currentLocations: LocationsDetails[] = [];
  pickedLocations: LocationsDetails[] = [];
  startPrice: number | null = null;
  endPrice: number | null = null;
  priceRangeList: NumberFromToJson[] = [] as NumberFromToJson[];
  priceFormGroup!: FormGroup;
  propertyIdSearchItems: string[] = [];
  propertyNameSearchItems: string[] = [];
  propertyTypes: string[] = [];
  currentPropertyTypes: string[] = [];
  currentBuilders: BuildersDetails[] = [];
  currentLocation: IActiveLocations = {} as IActiveLocations;
  currentCityListing: any = [];
  currentLocationList: any = []
  currentActiveCity: any;
  showLocality: any;
  countries:any;
  cityArry: any = [];

  constructor(private dataService: DataService, private httpService: HttpService, private formBuilder: FormBuilder) {
    this.defaultFilterValues();
    this.priceRangeList.push({ 'from': 0, 'to': 10000 }, { 'from': 10000, 'to': 50000 }, { 'from': 50000, 'to': 100000 });
    this.priceFormGroup = this.formBuilder.group(
      {
        minPrice: [],
        maxPrice: [],
      }
    );
  }

  ngOnInit(): void {
    this.initialApiFetch();
    this.initialObservers();
   this.fetchDropdownValues();
    // this.initiateApiRequests();
    // this.fetchProperties();
  }

  initialApiFetch(): void {
    if (this.dataService.cityAndBrandSubject.value.place_filters == undefined) {
      // this.fetchCityAndBuilderDetails();
    } else {
      this.cityAndBuildersDetails = this.dataService.cityAndBrandSubject.value;
    }
  }
  fetchDropdownValues() {
    this.httpService.fetchDroupdownInfo().then(
      res => {
       console.log(res);
      //  this.assetTypes= res.asset_types;
      // //  this.assetsCategories= res.asset_types;
      //  this.assetsOwnersType= res.ownership;
      //  this.assetsTransmissionType= res.transmission;
      //  this.assetsFeatures= res.asset_features;
      //  this.assetsBrands= res.brands;
      //  this.assetsFuelTypes= res.fuel_types;
       this.countries = res.data.locations;
       let cityArr: any = [];
      this.countries.forEach((country:any) =>{
        country.child_locations.forEach((state:any) =>{
          state.child_locations.forEach((city:any) =>{
            this.cityArry.push(city);
          });
        });
      });
      },
      err => {
        console.log(err);
      }
    );
  }
  initialObservers(): void {
    this.dataService.cityAndBrandObserver().subscribe(
      response => {
        this.cityAndBuildersDetails = response;
      },
      err => {
        console.log(err);
      }
    );
  }


  // initiateObservers(): void {
  //   this.dataService.propertyListingsObserver().subscribe(
  //     response => {
  //       this.propertyListings = response;
  //     },
  //     err => {
  //       console.log(err);
  //     }
  //   );
  // }

  // initiateApiRequests() {
  //   (document.getElementById("listingLoaderId") as HTMLBodyElement).style.display = "flex";
  //   // if (this.dataService.propertyListingsSubject.value.length <= 0) {
  //   this.fetchProperties();
  //   // } else {
  //   this.propertyListings = this.dataService.propertyListingsSubject.value;
  //   (document.getElementById("listingLoaderId") as HTMLBodyElement).style.display = "none";
  //   // }

  //   if (this.dataService.cityAndBuilderSubject.value.place_filters == undefined) {
  //     this.fetchCityAndBuilderDetails();
  //   }
  // }

  // fetchProperties() {
  //     this.httpService.fetchPropertyListings(this.dataService.propertyListingFiltersSubject.value).then(
  //       res => {
  //         this.dataService.propertyListingsSubject.next(res);
  //         (document.getElementById("listingLoaderId") as HTMLBodyElement).style.display = "none";
  //       },
  //       err => {
  //         (document.getElementById("listingLoaderId") as HTMLBodyElement).style.display = "none";
  //       }
  //     );
  // }

  

  fetchCityAndBuilderDetails() {
    this.httpService.fetchDroupdownInfo().then(
      res => {
        this.dataService.cityAndBrandSubject.next(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  // openDropDown(event: any) {
  //   if(this.propertyListings.length > 0){for (let property of this.propertyListings) {
  //     const v1 = property.asset_id;
  //     console.log('Property ID:', property.asset_id);
  //     console.log(v1);
  //     // Perform any other operations with the property ID
  //     }
  //   }
  //   const dropDown = document.getElementById('detailsDropDown') as HTMLBodyElement;
  //   const btn = document.getElementById('dropdownMenuButton');
  //   dropDown.style.display = 'block';
  //   dropDown.style.position = "absolute"; 
  //   }

  defaultFilterValues() {
    this.saleFilterType = ['All'].concat(SaleTypeArr);
    this.SPVFilterType = ['All'].concat(SPVTypeArr);
    this.NFTFilterType = ['All'].concat(NFTTypeArr);
    this.resaleFilterType = ['All'].concat(ResaleTypeArr);

    this.filterByPropertyStatusTypes(null, 'SALE');
    this.filterByPropertyStatusTypes(null, 'RESALE');
    this.filterByPropertyStatusTypes(null, 'SPV');
    this.filterByPropertyStatusTypes(null, 'NFT');

    let currentPropertyListingFilters = this.dataService.propertyListingFiltersSubject.value;

    // this.currentCity = [];

    // this.pickedLocations = [];
    // this.currentLocations = []
    
    currentPropertyListingFilters.filtersByPlaces = null;
    this.currentCityListing = [];
    this.currentLocationList = [];
    this.currentLocation = {};


    this.startPrice = null;
    this.endPrice = null;
    this.filterByCustomPrice();

    this.propertyIdSearchItems = [];
    currentPropertyListingFilters.filtersBySearch.asset_id = null;

    this.propertyNameSearchItems = [];
    currentPropertyListingFilters.filtersBySearch.asset_name = null;

    this.propertyTypes = ['All'].concat(PropertyTypes);
    this.filterByPropertyTypes(null);

    this.currentBuilders = [];
    // currentPropertyListingFilters.filtersByBuilders = null;

    this.updateFilterSubject(currentPropertyListingFilters);
    this.isPriceDetailsComplete = false;
  }

  filterByBuilders(builderItem: BuildersDetails | null): void {
    let currentPropertyListingFilters = this.dataService.propertyListingFiltersSubject.value;
    if (builderItem != null) {
      if (!this.currentBuilders.includes(builderItem)) {
        this.currentBuilders.push(builderItem);
      } else {
        this.currentBuilders = this.currentBuilders.filter(item => item != builderItem);
      }
    }
    // currentPropertyListingFilters.filtersByBuilders = this.getBuilderIds(this.currentBuilders);
    this.updateFilterSubject(currentPropertyListingFilters);
  }

  getBuilderIds(builderList: BuildersDetails[]): number[] | null {
    let builder_ids: number[] = [];
    builderList.forEach(element => {
      builder_ids.push(element.builder_id);
    });
    return builder_ids.length > 0 ? builder_ids : null;
  }

  filterByPropertyTypes(value: string | null) {
    let currentPropertyListingFilters = this.dataService.propertyListingFiltersSubject.value;
    if (value == null || value == undefined) {
      this.currentPropertyTypes = [];
      currentPropertyListingFilters.filtersByString.asset_type = null;
    } else if (value == 'All') {
      this.currentPropertyTypes = ['All'];
      currentPropertyListingFilters.filtersByString.asset_type = this.propertyTypes.filter((item: string) => item != 'All');
    } else {
      this.currentPropertyTypes = this.currentPropertyTypes.filter((item: string) => item != 'All');
      if (!this.currentPropertyTypes.includes(value)) {
        this.currentPropertyTypes.push(value);
      } else {
        this.currentPropertyTypes = this.currentPropertyTypes.filter((item: string) => item != value);
      }
      currentPropertyListingFilters.filtersByString.asset_type = this.currentPropertyTypes.length == 0 ? null : this.currentPropertyTypes;
    }
    this.updateFilterSubject(currentPropertyListingFilters);

  }

  filterByPropertyStatusTypes(value: string | null, type: string): void {
    let currentPropertyListingFilters = this.dataService.propertyListingFiltersSubject.value;
    switch (type) {
      case 'SALE':
        if (value == null || value == undefined) {
          this.currentSaleType = [];
          currentPropertyListingFilters.filtersByString.sale_status = null;
        } else if (value == 'All') {
          this.currentSaleType = ['All'];
          currentPropertyListingFilters.filtersByString.sale_status = this.saleFilterType.filter((item: string) => item != 'All');
        } else {
          this.currentSaleType = this.currentSaleType.filter((item: string) => item != 'All');
          if (!this.currentSaleType.includes(value)) {
            this.currentSaleType.push(value);
          } else {
            this.currentSaleType = this.currentSaleType.filter((item: string) => item != value);
          }
          currentPropertyListingFilters.filtersByString.sale_status = this.currentSaleType.length == 0 ? null : this.currentSaleType;
        }
        break;

      case 'RESALE':
        if (value == null || value == undefined) {
          this.currentResaleType = [];
          currentPropertyListingFilters.filtersByString.resale_status = null;
        } else if (value == 'All') {
          this.currentResaleType = ['All'];
          currentPropertyListingFilters.filtersByString.resale_status = this.resaleFilterType.filter((item: string) => item != 'All');
        } else {
          this.currentResaleType = this.currentResaleType.filter((item: string) => item != 'All');
          if (!this.currentResaleType.includes(value)) {
            this.currentResaleType.push(value);
          } else {
            this.currentResaleType = this.currentResaleType.filter((item: string) => item != value);
          }
          currentPropertyListingFilters.filtersByString.resale_status = this.currentResaleType.length == 0 ? null : this.currentResaleType;

        }
        break;

      case 'SPV':
        if (value == null || value == undefined) {
          this.currentSPVType = [];
          currentPropertyListingFilters.filtersByString.SPV_status = null;
        } else if (value == 'All') {
          this.currentSPVType = ['All'];
          currentPropertyListingFilters.filtersByString.SPV_status = this.SPVFilterType.filter((item: string) => item != 'All');
        } else {
          this.currentSPVType = this.currentSPVType.filter((item: string) => item != 'All');
          if (!this.currentSPVType.includes(value)) {
            this.currentSPVType.push(value);
          } else {
            this.currentSPVType = this.currentSPVType.filter((item: string) => item != value);
          }
          currentPropertyListingFilters.filtersByString.SPV_status = this.currentSPVType.length == 0 ? null : this.currentSPVType;
        }
        break;

      case 'NFT':
        if (value == null || value == undefined) {
          this.currentNFTType = [];
          currentPropertyListingFilters.filtersByString.NFT_status = null;
        } else if (value == 'All') {
          this.currentNFTType = ['All'];
          currentPropertyListingFilters.filtersByString.NFT_status = this.NFTFilterType.filter((item: string) => item != 'All');
        } else {
          this.currentNFTType = this.currentNFTType.filter((item: string) => item != 'All');
          if (!this.currentNFTType.includes(value)) {
            this.currentNFTType.push(value);
          } else {
            this.currentNFTType = this.currentNFTType.filter((item: string) => item != value);
          }
          currentPropertyListingFilters.filtersByString.NFT_status = this.currentNFTType.length == 0 ? null : this.currentNFTType;
        }
        break;

      default:
        console.log('No Filter Type specified');
        break;
    }
    this.updateFilterSubject(currentPropertyListingFilters);
  }

  getIsCitiesActive(id: any) {
    return this.currentCityListing.includes(id);
  }
  getIsLocationsActive(id: any) {
    return (this.currentLocation[this.currentActiveCity] ?? []).includes(id);
  }

  setCity(id: any, index: any) {
    let currentPropertyListingFilters = this.dataService.propertyListingFiltersSubject.value;
    if ((this.currentActiveCity ?? false) && this.currentActiveCity != id && this.currentCityListing.includes(id)) {
      this.cityArry.forEach((element: any) => {
        if (element.location_id === id) {
          this.currentLocationList = element.child_locations;
        }
      });
      this.currentActiveCity = id;
      return;
    }

    if (this.currentCityListing.includes(id)) {
      let currentCityListingIndex = this.currentCityListing.findIndex((city_id: any) => city_id == id);
      this.currentCityListing.splice(currentCityListingIndex, 1);
      this.cityArry.forEach((element: any) => {
        if (element.location_id === id) {
          let pickedCityIndex = currentPropertyListingFilters.filtersByPlaces?.findIndex((city_info: any) => city_info.city_id == id);
          currentPropertyListingFilters.filtersByPlaces?.splice(pickedCityIndex, 1);
          this.currentLocation[id] = [];
        }
      });
      this.currentActiveCity = id;
    } else {
      if (!currentPropertyListingFilters.filtersByPlaces) currentPropertyListingFilters.filtersByPlaces =[]
      this.showLocality = true;
      this.currentCityListing.push(id);
      this.cityArry.forEach((element: any) => {
        if (element.location_id === id) {
          this.currentLocationList = element.child_locations
          let pickedCityIndex = currentPropertyListingFilters.filtersByPlaces?.findIndex((city_info: any) => city_info.city_id == id);
          if (pickedCityIndex == -1) {
            currentPropertyListingFilters.filtersByPlaces?.push({ "city_id": id, "locations": [] });
          }
        }
      });
      this.currentActiveCity = id;
    }
    this.updateFilterSubject(currentPropertyListingFilters);
  }

  setLocation(id: any, index: any) {
    let currentPropertyListingFilters = this.dataService.propertyListingFiltersSubject.value;
    if ((this.currentLocation[this.currentActiveCity] ?? []).includes(id)) {
      let currentLocationIndex = this.currentLocation[this.currentActiveCity].findIndex((loc_id: any) => loc_id == id);
      this.currentLocation[this.currentActiveCity].splice(currentLocationIndex, 1);
      currentPropertyListingFilters.filtersByPlaces.forEach((element: any) => {
        if (element.city_id === this.currentActiveCity) {
          let pickedCityIndex = currentPropertyListingFilters.filtersByPlaces.findIndex((city_info: any) => city_info.city_id == this.currentActiveCity);
          let pickedLocIndex = currentPropertyListingFilters.filtersByPlaces[pickedCityIndex].locations.findIndex((location_id: any) => location_id == id);
          currentPropertyListingFilters.filtersByPlaces[pickedCityIndex].locations.splice(pickedLocIndex, 1);
          if (currentPropertyListingFilters.filtersByPlaces[pickedCityIndex].locations.length == 0) {
            currentPropertyListingFilters.filtersByPlaces.splice(pickedCityIndex, 1);
            this.currentCityListing = this.currentCityListing.filter((city_id: any) => city_id != this.currentActiveCity);
            this.currentActiveCity = id;
          }
        }
      });
    } else {
      if (!(this.currentLocation[this.currentActiveCity] ?? false)) {
        this.currentLocation[this.currentActiveCity] = [];
      }
      this.currentLocation[this.currentActiveCity].push(id);
      currentPropertyListingFilters.filtersByPlaces.forEach((element: any) => {
        if (element.city_id === this.currentActiveCity) {
          let pickedCityIndex = currentPropertyListingFilters.filtersByPlaces.findIndex((city_info: any) => city_info.city_id == this.currentActiveCity);
          if (pickedCityIndex == -1) {
            this.currentCityListing.push(this.currentActiveCity);
            currentPropertyListingFilters.filtersByPlaces.push({ "city_id": this.currentActiveCity, "locations": this.currentLocation[this.currentActiveCity] });
          } else {
            if (currentPropertyListingFilters.filtersByPlaces[pickedCityIndex].locations == undefined) {
              currentPropertyListingFilters.filtersByPlaces[pickedCityIndex].locations = [id];
            } else {
              currentPropertyListingFilters.filtersByPlaces[pickedCityIndex].locations.push(id);
            }
          }
        }
      });
    }
    this.updateFilterSubject(currentPropertyListingFilters);
  }


  // filterByCity(cityItem: PlaceDetails | null): void {
  //   let currentPropertyListingFilters = this.dataService.propertyListingFiltersSubject.value;
  //   if (cityItem != null) {
  //     if (!this.currentCity.includes(cityItem)) {
  //       this.currentCity.push(cityItem);
  //     } else {
  //       this.currentCity = this.currentCity.filter(item => item != cityItem);
  //     }
  //   }
  //   this.setLocationsByCity(this.currentCity);
  //   currentPropertyListingFilters.filtersByString.fk_city_id = this.getCityNames(this.currentCity);
  //   this.updateFilterSubject(currentPropertyListingFilters);
  // }

  // getCityNames(cityList: PlaceDetails[]): string[] | null {
  //   let city_names: string[] = [];
  //   cityList.forEach(element => {
  //     city_names.push(element.city_id);
  //   });
  //   return city_names.length > 0 ? city_names : null;
  // }

  // filterByLocations(locationItem: LocationsDetails | null): void {
  //   let currentPropertyListingFilters = this.dataService.propertyListingFiltersSubject.value;
  //   if (locationItem != null) {
  //     if (!this.pickedLocations.includes(locationItem)) {
  //       this.pickedLocations.push(locationItem);
  //     } else {
  //       this.pickedLocations = this.pickedLocations.filter(item => item != locationItem);
  //     }
  //   }
  //   currentPropertyListingFilters.filtersByString.fk_location_id = this.getLocationsNames(this.pickedLocations);
  //   this.updateFilterSubject(currentPropertyListingFilters);
  // }

  // getLocationsNames(locationList: LocationsDetails[]): number[] | null {
  //   let location_name: number[] = [];
  //   locationList.forEach(element => {
  //     location_name.push(element.location_id);
  //   });
  //   return location_name.length > 0 ? location_name : null;
  // }

  // setLocationsByCity(cities: PlaceDetails[]): void {
  //   this.currentLocations = [] as LocationsDetails[];
  //   cities.forEach(city => {
  //     city.locations.forEach(locations => {
  //       this.currentLocations.push(locations);
  //     });
  //   });
  // }

  filterByPrice(start: number, end: number) {
    let currentPropertyListingFilters = this.dataService.propertyListingFiltersSubject.value;
    this.startPrice = null;
    this.endPrice = null;
    currentPropertyListingFilters.filtersByPrice.price_per_token = { "from": start, "to": end } as NumberFromToJson;
    this.updateFilterSubject(currentPropertyListingFilters);
  }

  filterByCustomPrice() {
    let currentPropertyListingFilters = this.dataService.propertyListingFiltersSubject.value;
    for (let itemIndex = 0; itemIndex < this.priceRangeList.length; itemIndex++) {
      let item = (document.getElementById(`radio-price-${itemIndex}`) as HTMLInputElement);
      if (item != undefined) {
        item.checked = false;
      }
    }
    currentPropertyListingFilters.filtersByPrice.price_per_token = (this.startPrice == null && this.endPrice == null) ? null : { "from": this.startPrice, "to": this.endPrice } as NumberFromToJson;
    this.updateFilterSubject(currentPropertyListingFilters);
  }

  setSearchByFilterItem(value: HTMLInputElement, search_type: string): void {

    if (search_type == 'asset_id') {
      this.isPropertyIdEmpty = true;
      this.searchPropertyId = '';
      if (!this.propertyIdSearchItems.includes(value.value)) {
        let currentPropertyListingFilters = this.dataService.propertyListingFiltersSubject.value;
        this.propertyIdSearchItems.push(value.value);
        currentPropertyListingFilters.filtersBySearch.asset_id = this.propertyIdSearchItems;
        this.updateFilterSubject(currentPropertyListingFilters);
      }
    } else if (search_type == "asset_name") {
      this.isPropertyNameEmpty = true;
      this.searchPropertyName = '';
      if (!this.propertyNameSearchItems.includes(value.value)) {
        let currentPropertyListingFilters = this.dataService.propertyListingFiltersSubject.value;
        this.propertyNameSearchItems.push(value.value);
        currentPropertyListingFilters.filtersBySearch.asset_name = this.propertyNameSearchItems;
        this.updateFilterSubject(currentPropertyListingFilters);
      }
    }
    value.value = "";
  }

  removeSearchByFilterItem(value: string, search_type: string) {
    if (search_type == 'asset_id') {
      let currentPropertyListingFilters = this.dataService.propertyListingFiltersSubject.value;
      this.propertyIdSearchItems = this.propertyIdSearchItems.filter(elem => elem != value);
      // currentPropertyListingFilters.filtersBySearch.asset_id = this.propertyIdSearchItems;
      currentPropertyListingFilters.filtersBySearch.asset_id = this.propertyIdSearchItems.length > 0
      ? this.propertyIdSearchItems
      : null;
      this.updateFilterSubject(currentPropertyListingFilters);
    } else if (search_type == "asset_name") {
      let currentPropertyListingFilters = this.dataService.propertyListingFiltersSubject.value;
      this.propertyNameSearchItems = this.propertyNameSearchItems.filter(elem => elem != value);
      currentPropertyListingFilters.filtersBySearch.asset_name = this.propertyNameSearchItems;
      this.updateFilterSubject(currentPropertyListingFilters);
    }
  }

  updateFilterSubject(params: PropertyListingFilters) {
    if (this.dataService.propertyListingFiltersSubject.value.filtersBySearch.asset_name?.length === 0) {
      this.dataService.propertyListingFiltersSubject.value.filtersBySearch.asset_name = null;
    }
    if (this.dataService.propertyListingFiltersSubject.value.filtersBySearch.asset_id?.length === 0) {
      this.dataService.propertyListingFiltersSubject.value.filtersBySearch.asset_id = null;
    }
    this.disableApplyButtonCondition = this.isNoFilterSelected(params);
    this.dataService.propertyListingFiltersSubject.next(params);
  }

  onPropertyNameInputChange(event: any): void {
    this.searchPropertyName = event.target.value;
    this.isPropertyNameEmpty = this.searchPropertyName.trim().length === 0;
  }
  onPropertyIdInputChange(event: any): void {
    this.searchPropertyId = event.target.value;
    this.isPropertyIdEmpty = this.searchPropertyId.length === 0;
  }

  isNoFilterSelected(filters: PropertyListingFilters): boolean {
    return (
      filters.filtersByPlaces === null &&
      filters.filtersByString.sale_status === null &&
      filters.filtersByString.resale_status === null &&
      filters.filtersByString.SPV_status === null &&
      filters.filtersByString.NFT_status === null &&
      filters.filtersByPrice.price_per_token === null &&
      filters.filtersBySearch.asset_id === null &&
      filters.filtersBySearch.asset_name === null &&
      filters.filtersByString.asset_type === null
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

    if (return_value == '' || return_value == undefined) {
      return_value = value;
    }
    return return_value;
  }

  closePopup() {
    (document.getElementById("propertyListingFiltersId") as HTMLBodyElement).style.display = "none";
  }

  fetchProperties() {
    (document.getElementById("listingLoaderId") as HTMLBodyElement).style.display = "flex";
    this.httpService.fetchPropertyListings(this.dataService.propertyListingFiltersSubject.value).then(
      res => {
        this.dataService.propertyListingsSubject.next(res.response);
        (document.getElementById("listingLoaderId") as HTMLBodyElement).style.display = "none";
      },
      err => {
        (document.getElementById("listingLoaderId") as HTMLBodyElement).style.display = "none";
      }
    );
  }
  onPropertyPriceChange(event: any): void {
    this.isPriceDetailsComplete =false;
  }
  
  applyFilter() {
    let minPrice = this.priceFormGroup.controls['minPrice'].value;
    let maxPrice = this.priceFormGroup.controls['maxPrice'].value;
    if((minPrice === null && maxPrice === null)){
      this.fetchProperties();
      this.closePopup();
    } else if(minPrice !== null && maxPrice !== null  ){
      if( minPrice < maxPrice){
        this.fetchProperties();
        this.closePopup();
      }
    }else{
      this.isPriceDetailsComplete =true;
    }
  }

  clearFilter() {
    this.defaultFilterValues();
    this.fetchProperties();
  }
}
