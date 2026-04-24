import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CityAndBrandDetails,  PropertyListingFilters, PropertyListings, emptyPropertyListingFilter } from '../modals/property-listings.modal';
import { ApiModal, ModalTypes } from '../modals/modal.modal';
import { BuyersListing, BuyersListingFilters, BuyersListings, emptyBuyersListingFilter } from '../modals/buyersListing';
import { KYCLisitng, KYCLisitngs, KYCListingFilters, emptyKYCListingFilter } from '../modals/kyc.modal';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  //Modals
  apiErrorModalSubject = new BehaviorSubject({} as ApiModal);
  apiSuccessModalSubject = new BehaviorSubject({} as ApiModal);
  apiConfirmModalSubject = new BehaviorSubject({} as ApiModal);

  //Property Listings
  propertyListingFiltersSubject = new BehaviorSubject(emptyPropertyListingFilter as PropertyListingFilters);
  propertyListingsSubject = new BehaviorSubject([] as PropertyListings);
  cityAndBrandSubject = new BehaviorSubject({} as CityAndBrandDetails);

  //Buyers Listings
  buyersListingFiltersSubject = new BehaviorSubject(emptyBuyersListingFilter as BuyersListingFilters);
  buyerListingsSubject = new BehaviorSubject([] as BuyersListings);

  //KYC Listings
  kycListingFiltersSubject = new BehaviorSubject(emptyKYCListingFilter as KYCListingFilters);
  kycListingsSubject = new BehaviorSubject([] as KYCLisitng[]);

  staffIdSubject = new BehaviorSubject('');
  loginSubject = new BehaviorSubject(false);


  constructor() {
    this.staffIdObserver().subscribe(data => {
      if (data != "" && data != null) {
        this.loginSubject.next(true);
      } else {
        this.loginSubject.next(false);
      }
    })
    this.staffIdSubject.next(localStorage.getItem('staff_id') ?? '');
  }

  //==============================Modal Observers==============================================
  modalObservers(modal_type: string): Observable<ApiModal> {
    let return_observer = new Observable<ApiModal>();
    switch (modal_type) {
      case ModalTypes.ERR_API:
        return_observer = this.apiErrorModalSubject.asObservable();
        break;
      default:
      case ModalTypes.SUCCESS_API:
        return_observer = this.apiSuccessModalSubject.asObservable();
        break;
      case ModalTypes.CONFIRM_API:
        return_observer = this.apiConfirmModalSubject.asObservable();
        break;
    }

    return return_observer;
  }

  modalUpdater(modal_type: string): BehaviorSubject<ApiModal> {
    let return_observer = {} as BehaviorSubject<ApiModal>;
    switch (modal_type) {
      case ModalTypes.ERR_API:
        return_observer = this.apiErrorModalSubject;
        break;

      default:
      case ModalTypes.SUCCESS_API:
        return_observer = this.apiSuccessModalSubject;
        break;
        case ModalTypes.CONFIRM_API:
        return_observer = this.apiConfirmModalSubject;
        break;
    }

    return return_observer;
  }

  //==============================Modal Observers==============================================

  propertyListingFiltersObserver(): Observable<PropertyListingFilters> {
    return this.propertyListingFiltersSubject.asObservable();
  }

  propertyListingsObserver(): Observable<PropertyListings> {
    return this.propertyListingsSubject.asObservable();
  }

  buyerListingsObserver(): Observable<BuyersListings> {
    return this.buyerListingsSubject.asObservable();
  }
  buyerFiltersObserver(): Observable<BuyersListingFilters> {
    return this.buyersListingFiltersSubject.asObservable();
  }

  kycListingsObserver(): Observable<KYCLisitng[]> {
    return this.kycListingsSubject.asObservable();
  }

  kycFiltersObserver(): Observable<KYCListingFilters> {
    return this.kycListingFiltersSubject.asObservable();
  }


  cityAndBrandObserver(): Observable<CityAndBrandDetails> {
    return this.cityAndBrandSubject.asObservable();
  }

  staffIdObserver(): Observable<string> {
    return this.staffIdSubject.asObservable();
  }

  loginObserver(): Observable<boolean> {
    return this.loginSubject.asObservable();
  }

}
